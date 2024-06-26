import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { Product } from '@prisma/client'
import { Cache } from 'cache-manager'
import { getStoreDetail, updateQuantityProduct } from 'common/constants/event.constant'
import { room_obj } from 'common/constants/socket.constant'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { hash } from 'common/utils/helper'
import { CronJob } from 'cron'
import { isUndefined, keyBy, omitBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { AnalyticsProductDTO } from './dtos/analytics-product.dto'
import { CreateUserAddProductToCartDTO } from './dtos/create-product-add-to-cart.dto'
import { CreateUserViewProductDto } from './dtos/create-product-view.dto'
import { CreateProductType } from './dtos/create-product.dto'
import { QueryProductType } from './dtos/query-product.dto'
import { RefreshCartDTO } from './dtos/refresh-cart.dto'
import { UpdateProductType } from './dtos/update-product.dto'

@Injectable()
export class ProductService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('SOCKET_SERVICE') private readonly socket_client: ClientProxy,
        @Inject('STORE_SERVICE') private readonly store_service: ClientProxy,
        @Inject('PRODUCT_SERVICE') private readonly product_client: ClientProxy,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private schedulerRegistry: SchedulerRegistry
    ) {}

    async getALlProductForUser(query: QueryProductType): Promise<Return> {
        try {
            const {
                category,
                createdAt,
                price_max,
                price_min,
                sold,
                price,
                limit,
                page,
                max_date,
                min_date
            } = query

            if (
                Object.keys(
                    omitBy(
                        {
                            createdAt,
                            sold,
                            price
                        },
                        isUndefined
                    )
                ).length > 1
            ) {
                throw new BadRequestException('Tối đa 1 field order')
            }

            const [productAllLength, products] = await Promise.all([
                this.prisma.product.count({
                    where: {
                        category,
                        priceAfter: {
                            lte: price_max,
                            gte: price_min
                        },
                        status: 'ACTIVE',
                        createdAt: {
                            gte: min_date,
                            lte: max_date
                        },
                        currentQuantity: {
                            gt: 0
                        }
                    }
                }),
                this.prisma.product.findMany({
                    where: {
                        category,
                        priceAfter: {
                            lte: price_max,
                            gte: price_min
                        },
                        status: 'ACTIVE',
                        createdAt: {
                            gte: min_date,
                            lte: max_date
                        },
                        currentQuantity: {
                            gt: 0
                        }
                    },
                    orderBy: {
                        createdAt,
                        sold,
                        priceAfter: price
                    },
                    take: limit || this.configService.get<number>('app.limit_default'),
                    skip:
                        page && page > 0
                            ? (page - 1) *
                              (limit || this.configService.get<number>('app.limit_default'))
                            : 0
                })
            ])

            const storeIdList = products.map((product) => product.storeId)

            const storeList = await firstValueFrom<MessageReturn>(
                this.store_service.send(getStoreDetail, storeIdList)
            )

            if (!storeList.action) {
                throw new Error(storeList.msg)
            }

            const result = products.map((product) => {
                return {
                    ...product,
                    store: storeList.result[product.storeId]
                }
            })

            return {
                msg: 'Lấy danh sách sản phẩm thành công',
                result: {
                    data: result,
                    query: omitBy(
                        {
                            ...query,
                            page: page || 1,
                            page_size: Math.ceil(
                                productAllLength /
                                    (limit || this.configService.get<number>('app.limit_default'))
                            )
                        },
                        isUndefined
                    )
                }
            }
        } catch (err) {
            console.log('error', err)
            throw new InternalServerErrorException(err.message)
        }
    }

    async getProductByProductOrder(productsId: string[]) {
        const products = await Promise.all(
            productsId.map((id) =>
                this.prisma.product.findUnique({
                    where: {
                        id
                    }
                })
            )
        )
        return keyBy(products, 'id')
    }

    async getALlProductForStore(storeId: string, query: QueryProductType): Promise<Return> {
        const {
            category,
            createdAt,
            price_max,
            price_min,
            sold,
            price,
            limit,
            page,
            max_date,
            min_date,
            status
        } = query

        if (
            Object.keys(
                omitBy(
                    {
                        createdAt,
                        sold,
                        price
                    },
                    isUndefined
                )
            ).length > 1
        ) {
            throw new BadRequestException('Tối đa 1 field order')
        }

        const [productAllLength, products] = await Promise.all([
            this.prisma.product.count({
                where: {
                    storeId,
                    category,
                    status,
                    priceAfter: {
                        lte: price_max,
                        gte: price_min
                    },
                    createdAt: {
                        gte: min_date,
                        lte: max_date
                    }
                }
            }),
            this.prisma.product.findMany({
                where: {
                    storeId,
                    category,
                    status,
                    priceAfter: {
                        lte: price_max,
                        gte: price_min
                    },
                    createdAt: {
                        gte: min_date,
                        lte: max_date
                    }
                },
                orderBy: {
                    createdAt,
                    sold,
                    priceAfter: price
                },
                take: limit || this.configService.get<number>('app.limit_default'),
                skip:
                    page && page > 0
                        ? (page - 1) *
                          (limit || this.configService.get<number>('app.limit_default'))
                        : 0
            })
        ])

        return {
            msg: 'Lấy danh sách sản phẩm thành công',
            result: {
                data: products,
                query: omitBy(
                    {
                        ...query,
                        page: page || 1,
                        page_size: Math.ceil(
                            productAllLength /
                                (limit || this.configService.get<number>('app.limit_default'))
                        )
                    },
                    isUndefined
                )
            }
        }
    }

    async getAllProductOrderByOrderId(orderId: string): Promise<Return> {
        return {
            msg: 'ok',
            result: await this.prisma.productOrder.findMany({
                where: {
                    orderId
                },
                include: {
                    Product: true
                }
            })
        }
    }

    async getProductDetail(productId: string): Promise<Return> {
        const [productExist, cached, imgs] = await Promise.all([
            this.prisma.product.findUnique({
                where: {
                    id: productId,
                    status: Status.ACTIVE
                }
            }),
            this.cacheManager.get(hash('product', productId)),
            this.prisma.productImage.findMany({
                where: {
                    productId
                }
            })
        ])

        if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

        return {
            msg: 'Lấy thông tin chi tiết sản phẩm thành công',
            result: {
                ...productExist,
                productImages: imgs,
                currentQuantity: cached || productExist.currentQuantity
            } as Product
        }
    }

    async analyticsProduct(store: CurrentStoreType): Promise<Return> {
        const [all, active, block, deleted] = await Promise.all([
            this.prisma.product.count({
                where: {
                    storeId: store.storeId
                }
            }),
            this.prisma.product.count({
                where: {
                    isDelete: false,
                    status: 'ACTIVE',
                    storeId: store.storeId
                }
            }),
            this.prisma.product.count({
                where: {
                    isDelete: false,
                    status: 'BLOCK',
                    storeId: store.storeId
                }
            }),
            this.prisma.product.count({
                where: {
                    isDelete: true,
                    storeId: store.storeId
                }
            })
        ])

        return {
            msg: 'Lấy thông tin thành công',
            result: {
                all,
                active,
                block,
                deleted
            }
        }
    }

    async createProduct(user: CurrentStoreType, body: CreateProductType): Promise<Return> {
        const { storeId, userId } = user

        const {
            name,
            initQuantity,
            priceAfter,
            priceBefore,
            description,
            status,
            category,
            productImages,
            imagePrimary
        } = body

        const createdProduct = await this.prisma.product.create({
            data: {
                id: uuidv4(),
                name,
                currentQuantity: initQuantity,
                initQuantity,
                priceBefore: priceBefore || 0,
                priceAfter: priceAfter,
                description,
                image: imagePrimary,
                status: status || Status.ACTIVE,
                storeId,
                createdBy: userId,
                category
            }
        })

        await Promise.all(
            productImages.map((img) =>
                this.prisma.productImage.create({
                    data: {
                        id: uuidv4(),
                        url: img,
                        createdAt: new Date(),
                        createdBy: user.userId,
                        productId: createdProduct.id
                    }
                })
            )
        )

        return {
            msg: 'Tạo sản phẩm thành công',
            result: {
                ...createdProduct,
                productImages
            }
        }
    }

    async createViewProduct(body: CreateUserViewProductDto): Promise<Return> {
        const result = await this.prisma.userViewProduct.create({
            data: {
                id: uuidv4(),
                userId: body.userId,
                productId: body.productId,
                createdAt: new Date().toISOString()
            }
        })

        return {
            msg: 'ok',
            result
        }
    }

    async createUserAddProductToCart(body: CreateUserAddProductToCartDTO): Promise<Return> {
        const { productId, quantity } = body

        const result = await this.prisma.userAddProductToCart.create({
            data: {
                id: uuidv4(),
                productId,
                quantity,
                userId: body.userId,
                createdAt: new Date().toISOString()
            }
        })

        return {
            msg: 'ok',
            result
        }
    }

    async updateProduct(
        user: CurrentStoreType,
        productId: string,
        body: UpdateProductType
    ): Promise<Return> {
        const { storeId } = user
        const productExist = await this.prisma.product.findUnique({
            where: {
                id: productId,
                storeId
            }
        })

        if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

        const { category, description, initQuantity, name, priceAfter, priceBefore, status } = body

        const init = initQuantity ?? 0

        return {
            msg: 'Cập nhật sản phẩm thành công',
            result: await this.prisma.product.update({
                where: {
                    id: productId,
                    storeId
                },
                data: {
                    category,
                    initQuantity:
                        init > 0
                            ? {
                                  increment: init
                              }
                            : {
                                  decrement: init
                              },
                    currentQuantity:
                        init > 0
                            ? {
                                  increment: init
                              }
                            : {
                                  decrement: init
                              },
                    name,
                    description,
                    priceAfter,
                    priceBefore,
                    status
                }
            })
        }
    }

    async deleteProduct(user: CurrentStoreType, productId: string): Promise<Return> {
        const { userId } = user

        const productExist = await this.prisma.product.update({
            where: {
                id: productId
            },
            data: {
                deletedAt: new Date(),
                deletedBy: userId
            }
        })

        if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

        return {
            msg: 'Xóa sản phẩm thành công',
            result: undefined
        }
    }

    emitUpdateProductToSocket(productId: string, quantity: number, priceAfter: number) {
        this.socket_client.emit(updateQuantityProduct, {
            type: room_obj.product,
            id: productId,
            quantity: 0,
            priceAfter
        })
    }

    async updateQuantityProducts(
        data: {
            storeId: string
            note?: string
            productId: string
            quantity: number
        }[]
    ): Promise<MessageReturn> {
        try {
            await Promise.all(
                data.map((e) => this.updateQuantity(e.productId, e.storeId, e.quantity))
            )
            return {
                msg: 'ok',
                action: true,
                result: null
            }
        } catch (err) {
            console.log('error', err)
            return {
                msg: (err as Error).message,
                action: false,
                result: null
            }
        }
    }

    async updateQuantity(productId: string, storeId: string, buy: number) {
        const hashValue = hash('product', productId)

        const fromCache = await this.cacheManager.get<string>(hashValue)

        if (fromCache) {
            const { quantity, priceAfter } = JSON.parse(fromCache) as {
                quantity: number
                priceAfter: number
            }
            if (quantity === buy) {
                await Promise.all([
                    this.cacheManager.set(
                        hashValue,
                        JSON.stringify({ quantity: 0, priceAfter }),
                        1000 * 60 * 5
                    ),
                    this.prisma.product.update({
                        where: {
                            id: productId
                        },
                        data: {
                            currentQuantity: 0
                        }
                    })
                ])
                this.emitUpdateProductToSocket(productId, 0, priceAfter)
                this.schedulerRegistry.deleteCronJob(hashValue)
                return {
                    msg: 'ok',
                    action: true,
                    result: null
                }
            }

            let remainingQuantity = quantity - buy

            await this.cacheManager.set(
                hashValue,
                JSON.stringify({ quantity: remainingQuantity, priceAfter } as {
                    quantity: number
                    priceAfter: number
                })
            )

            this.emitUpdateProductToSocket(productId, remainingQuantity, priceAfter)

            return {
                msg: 'ok',
                action: true,
                result: null
            }
        }

        const productExist = await this.prisma.product.findUnique({
            where: {
                id: productId,
                storeId
            }
        })

        if (!productExist) {
            throw new Error('Sản phẩm không tồn tại')
        }

        if (productExist.currentQuantity < buy) {
            throw new Error(`Sản phẩm ${productId} không đủ số lượng`)
        }

        if (productExist.currentQuantity === buy) {
            await Promise.all([
                this.cacheManager.set(
                    hashValue,
                    JSON.stringify({
                        quantity: 0,
                        priceAfter: productExist.priceAfter
                    })
                ),
                this.prisma.product.update({
                    where: {
                        id: productId
                    },
                    data: {
                        currentQuantity: 0
                    }
                })
            ])

            this.emitUpdateProductToSocket(productId, 0, productExist.priceAfter)

            return {
                msg: 'ok',
                action: true,
                result: null
            }
        }

        let remainingQuantity = productExist.currentQuantity - buy

        await this.cacheManager.set(
            hashValue,
            JSON.stringify({ quantity: remainingQuantity, priceAfter: productExist.priceAfter })
        )

        this.emitUpdateProductToSocket(productId, remainingQuantity, productExist.priceAfter)

        const updateQuantityJob = new CronJob(CronExpression.EVERY_5_MINUTES, async () => {
            const [fromCache, productIn] = await Promise.all([
                this.cacheManager.get<string>(hashValue),
                this.prisma.product.findUnique({
                    where: {
                        id: productId
                    }
                })
            ])
            let { quantity } = JSON.parse(fromCache) as { quantity: number; priceAfter: number }
            let tmp = []
            if (quantity === productIn.currentQuantity) {
                tmp.push(this.cacheManager.del(hashValue))
            }
            await Promise.all([
                this.prisma.product.update({
                    where: {
                        id: productId,
                        storeId
                    },
                    data: {
                        currentQuantity: quantity
                    }
                }),
                ...tmp
            ])

            if (tmp.length) {
                this.schedulerRegistry.deleteCronJob(hashValue)
            }
        })

        this.schedulerRegistry.addCronJob(hashValue, updateQuantityJob)

        updateQuantityJob.start()

        return {
            msg: 'ok',
            action: true,
            result: null
        }
    }

    async updateQuantiyProductsWhenCancelOrder(orderId: string): Promise<MessageReturn> {
        try {
            const productOrderExists = await this.prisma.productOrder.findMany({
                where: {
                    orderId
                }
            })
            if (!productOrderExists.length) {
                return {
                    msg: 'Sản phẩm trong đơn hàng không tồn tại',
                    action: false,
                    result: null
                }
            }

            await Promise.all(
                productOrderExists.map(async ({ productId, quantity }) => {
                    let hashValue = hash('product', productId)
                    let fromCache = await this.cacheManager.get<string>(hashValue)

                    if (fromCache) {
                        let { quantity: quantityFromCache, priceAfter } = JSON.parse(fromCache) as {
                            quantity: number
                            priceAfter: number
                        }
                        this.emitUpdateProductToSocket(
                            productId,
                            quantity + quantityFromCache,
                            priceAfter
                        )

                        return Promise.resolve<MessageReturn>({
                            action: true,
                            msg: 'ok',
                            result: null
                        })
                    }

                    let productExist = await this.prisma.product.findUnique({
                        where: {
                            id: productId
                        }
                    })

                    if (!productExist) {
                        return Promise.reject<MessageReturn>({
                            action: false,
                            msg: 'Sản phẩm không tồn tại'
                        })
                    }

                    return this.prisma.product.update({
                        where: {
                            id: productId
                        },
                        data: {
                            currentQuantity: {
                                increment: quantity
                            }
                        }
                    })
                })
            )
            return {
                msg: 'ok',
                action: true,
                result: null
            }
        } catch (err) {
            return {
                msg: err?.message || 'Cập nhật lại số lượng sản phẩm không thành công',
                action: false,
                result: null
            }
        }
    }

    async createProductOrder(
        data: {
            orderId: string
            productId: string
            priceAfter: number
            priceBefore: number
            quantity: number
        }[]
    ) {
        try {
            const orders = await Promise.all(
                data.map((e) =>
                    this.prisma.order.findUnique({
                        where: {
                            id: e.orderId
                        }
                    })
                )
            )

            const result = await Promise.all(
                data.map((e) =>
                    this.prisma.productOrder.create({
                        data: {
                            id: uuidv4(),
                            priceAfter: e.priceAfter,
                            priceBefore: e.priceBefore,
                            quantity: e.quantity,
                            orderId: e.orderId,
                            productId: e.productId
                        }
                    })
                )
            )

            return result
        } catch (err) {
            return 'Lỗi tạo product-order'
        }
    }

    async updateData() {
        const products = await this.prisma.product.findMany()

        await Promise.all(
            products.map((product) =>
                this.prisma.productImage.create({
                    data: {
                        id: uuidv4(),
                        url: product.image,
                        productId: product.id,
                        createdAt: new Date(),
                        createdBy: product.createdBy
                    }
                })
            )
        )

        return {
            msg: 'ok'
        }
    }

    async top10ProductView(user: CurrentStoreType, body: AnalyticsProductDTO) {
        const { dates } = body
        const { storeId } = user

        const orders_dates = await Promise.all(
            dates.map((day, idx) =>
                this.prisma.userViewProduct.count({
                    where: {}
                })
            )
        )
    }

    async getProductOrderByRating(productId: string, orders: string[]) {
        return await Promise.all(
            orders.map((orderId) =>
                this.prisma.productOrder.findMany({
                    where: {
                        orderId,
                        productId
                    }
                })
            )
        )
    }

    async refreshCart(body: RefreshCartDTO): Promise<Return> {
        const products = await Promise.all(
            body.productsId.map((productId) => this.findProductUnique(productId))
        )

        return {
            msg: 'ok',
            result: body.productsId.reduce<Record<string, Product>>(
                (acum, productId, idx) => ({ ...acum, [productId]: products[idx] }),
                {}
            )
        }
    }

    async findProductUnique(id: string): Promise<Product | undefined> {
        try {
            const [product, cached] = await Promise.all([
                this.prisma.product.findUnique({
                    where: {
                        id,
                        status: Status.ACTIVE,
                        currentQuantity: {
                            gt: 0
                        }
                    }
                }),
                this.cacheManager.get(hash('product', id))
            ])

            if (!product) {
                return undefined
            }

            return {
                ...product,
                currentQuantity: +cached || product.currentQuantity
            }
        } catch (error) {
            throw new BadRequestException('Lỗi')
        }
    }

    async getAllProductBySalePromotion(productIds: string[]) {
        try {
            const products = await Promise.all(
                productIds.map((id) =>
                    this.prisma.product.findUnique({
                        where: {
                            id,
                            status: Status.ACTIVE,
                            currentQuantity: {
                                gt: 0
                            },
                            isDelete: false
                        },
                        select: {
                            id: true,
                            name: true,
                            priceAfter: true,
                            priceBefore: true,
                            currentQuantity: true
                        }
                    })
                )
            )

            return {
                msg: 'ok',
                action: true,
                result: products
            }
        } catch (_) {
            return {
                msg: 'Lỗi Server',
                action: false,
                result: null
            }
        }
    }

    async getProductImageByProductSalePromotion(productIds: string[]) {
        try {
            const products = await Promise.all(
                productIds.map((id) =>
                    this.prisma.product.findUnique({
                        where: {
                            id
                        },
                        select: {
                            name: true,
                            image: true
                        }
                    })
                )
            )

            return {
                msg: 'ok',
                action: true,
                result: products
            }
        } catch (err) {
            return {
                msg: 'Lỗi lấy dữ liệu từ product',
                action: false,
                result: null
            }
        }
    }

    async testing() {
        // const cache = await firstValueFrom(this.product_client.send('testing', { msg: 'ok' }))
        return {
            msg: 'ok',
            result: await this.testingPattern()
        }
    }

    async testingPattern() {
        const cache = await this.cacheManager.get('testing')
        const tmp = cache ? +cache - 1 : 100 - 1
        await this.cacheManager.set('testing', tmp)
        return await this.cacheManager.get('testing')
    }
}
