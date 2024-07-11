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
import { Prisma, PrismaClient, Product } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { Cache } from 'cache-manager'
import {
    commitOrder,
    getProductSaleEvent,
    getStoreDetail,
    rollbackOrder,
    statusOfOrder,
    updateQuantityProduct,
    updateVoucherWhenCreatingOrder
} from 'common/constants/event.constant'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { OrderPayload } from 'common/types/order_payload.type'
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
        @Inject('STORE_SERVICE') private readonly store_client: ClientProxy,
        @Inject('PRODUCT_SERVICE') private readonly product_client: ClientProxy,
        @Inject('ORDER_SERVICE') private readonly order_client: ClientProxy,
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
                this.store_client.send(getStoreDetail, storeIdList)
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

    async getProductByProductOrder(productsId: string[]): Promise<MessageReturn> {
        try {
            const products = await Promise.all(
                productsId.map((id) =>
                    this.prisma.product.findUnique({
                        where: {
                            id
                        }
                    })
                )
            )

            return {
                msg: 'ok',
                action: true,
                result: keyBy(products, 'id')
            }
        } catch (err) {
            return {
                msg: 'Lỗi server',
                action: false,
                result: null
            }
        }
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
        const [productExist, cached, imgs, productSale] = await Promise.all([
            this.prisma.product.findUnique({
                where: {
                    id: productId,
                    status: Status.ACTIVE,
                    currentQuantity: {
                        gt: 0
                    }
                }
            }),
            this.cacheManager.get<string>(hash('product', productId)),
            this.prisma.productImage.findMany({
                where: {
                    productId
                }
            }),
            firstValueFrom(this.store_client.send<MessageReturn>(getProductSaleEvent, productId))
        ])

        if (!productExist) throw new NotFoundException('Sản phẩm không tồn tại')

        return {
            msg: 'Lấy thông tin chi tiết sản phẩm thành công',
            result: {
                ...productExist,
                productImages: imgs,
                currentQuantity: cached
                    ? JSON.parse(cached).quantity
                    : productExist.currentQuantity,
                sale: productSale.action ? productSale.result : null
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

        return {
            msg: 'Cập nhật sản phẩm thành công',
            result: await this.prisma.product.update({
                where: {
                    id: productId,
                    storeId
                },
                data: {
                    category,
                    initQuantity,
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

    async emitUpdateProductToSocket(
        storeId: string,
        productId: string,
        quantity: number,
        priceAfter: number,
        times = 2
    ) {
        try {
            await this.cacheManager.set(
                hash('product', productId),
                JSON.stringify({ quantity, priceAfter, times })
            )
            this.socket_client.emit(updateQuantityProduct, {
                productId,
                storeId,
                quantity,
                priceAfter
            })
        } catch (err) {
            throw new Error('Lỗi cập nhật dữ liệu')
        }
    }

    async updateProductWhenCreatingOrder(order_payload: OrderPayload) {
        let { body, user } = order_payload
        let productActionId = hash('product', uuidv4())
        var tmp: {
            productId: string
            original_quantity: number
            quantity: number
            priceAfter: number
            storeId: string
        }[] = []
        this.prisma
            .$transaction(async (tx) => {
                for (let order of body.orders) {
                    for (let { productId, quantity: buy } of order.productOrders) {
                        try {
                            let hashValue = hash('product', productId)
                            let fromCache = await this.cacheManager.get<string>(hashValue)

                            if (fromCache) {
                                let { quantity, priceAfter } = JSON.parse(fromCache) as {
                                    quantity: number
                                    priceAfter: number
                                }

                                if (quantity == 0) {
                                    throw new Error('Sản phẩm đã hết hàng')
                                }

                                tmp.push({
                                    productId,
                                    original_quantity: quantity,
                                    quantity: quantity - buy,
                                    priceAfter,
                                    storeId: order.storeId
                                })

                                if (quantity === buy) {
                                    await tx.product.update({
                                        where: {
                                            id: productId
                                        },
                                        data: {
                                            currentQuantity: 0,
                                            updatedAt: new Date()
                                        }
                                    })
                                }
                            } else {
                                const productExist = await tx.product.findUnique({
                                    where: {
                                        id: productId
                                    },
                                    select: {
                                        currentQuantity: true,
                                        priceAfter: true
                                    }
                                })

                                if (!productExist) {
                                    throw new Error('Sản phẩm không tồn tại')
                                }

                                if (productExist.currentQuantity == 0) {
                                    throw new Error('Sản phẩm đã hết hàng')
                                }

                                if (productExist.currentQuantity < buy) {
                                    throw new Error('Sản phẩm không đủ số lượng')
                                }

                                tmp.push({
                                    productId,
                                    quantity: productExist.currentQuantity - buy,
                                    priceAfter: productExist.priceAfter,
                                    original_quantity: productExist.currentQuantity,
                                    storeId: order.storeId
                                })

                                if (productExist.currentQuantity === buy) {
                                    await tx.product.update({
                                        where: {
                                            id: productId
                                        },
                                        data: {
                                            currentQuantity: 0,
                                            updatedAt: new Date()
                                        }
                                    })
                                }
                            }
                        } catch (err) {
                            console.log('*******Lỗi Bước 2 transaction (LINE 643)********')
                        }
                    }
                }
            })
            .then(async (_) => {
                try {
                    // Tạo cron job cho từng sản phẩm
                    await Promise.all(
                        tmp.map(async ({ productId, priceAfter }) => {
                            let hashValue = hash('product', productId)
                            let is_exist_cron_job = this.schedulerRegistry.doesExist(
                                'cron',
                                hashValue
                            )
                            if (is_exist_cron_job) return

                            let update_product_quantity_job = new CronJob(
                                CronExpression.EVERY_5_MINUTES,
                                async () => {
                                    let dataProductFromCache =
                                        await this.cacheManager.get<string>(hashValue)

                                    if (dataProductFromCache) {
                                        let { quantity: quantityFromCache, times } = JSON.parse(
                                            dataProductFromCache
                                        ) as {
                                            quantity: number
                                            priceAfter: number
                                            times: number
                                        }
                                        const quantityFromDB = await this.prisma.product.findUnique(
                                            {
                                                where: {
                                                    id: productId
                                                },
                                                select: {
                                                    currentQuantity: true
                                                }
                                            }
                                        )

                                        if (!quantityFromDB) {
                                            return
                                        }

                                        let isActive = times == 1

                                        await Promise.all([
                                            this.prisma.product.update({
                                                where: {
                                                    id: productId
                                                },
                                                data: {
                                                    currentQuantity: quantityFromCache,
                                                    updatedAt: new Date()
                                                }
                                            }),
                                            this.cacheManager.set(
                                                hashValue,
                                                JSON.stringify({
                                                    quantity: quantityFromCache,
                                                    priceAfter,
                                                    times: times - 1
                                                })
                                            )
                                        ])
                                        if (!isActive) {
                                            await this.cacheManager.del(hashValue)
                                            let cron_job =
                                                this.schedulerRegistry.getCronJob(hashValue)
                                            if (cron_job) {
                                                cron_job.stop()
                                                this.schedulerRegistry.deleteCronJob(hashValue)
                                            }
                                        }
                                    }
                                }
                            )
                            this.schedulerRegistry.addCronJob(
                                hashValue,
                                update_product_quantity_job
                            )
                            update_product_quantity_job.start()
                            return Promise.resolve('ok')
                        })
                    )

                    // Emit cập nhật số lượng và cache cho từng sản phẩm
                    await Promise.all(
                        tmp.map(({ storeId, productId, quantity, priceAfter }) => {
                            return this.emitUpdateProductToSocket(
                                storeId,
                                productId,
                                quantity,
                                priceAfter
                            )
                        })
                    )

                    // tạo croll back tổng cho product. Những sản phẩm nào quantity = 0 thì sẽ cập nhật lại dưới db và còn lại thì cập nhật emit
                    const rollback_job = new CronJob(hash('product', productActionId), async () => {
                        console.log('******Tiến hành roll back product**********')
                        await Promise.all(
                            tmp.map(({ storeId, productId, priceAfter, original_quantity }) => {
                                return this.emitUpdateProductToSocket(
                                    storeId,
                                    productId,
                                    original_quantity,
                                    priceAfter
                                )
                            })
                        )
                        const product_out_of_stock = tmp.filter((item) => !item.quantity)
                        try {
                            await this.prisma.$transaction(async (tx) => {
                                try {
                                    await Promise.all(
                                        product_out_of_stock.map(
                                            ({ productId, original_quantity }) => {
                                                return tx.product.update({
                                                    where: {
                                                        id: productId
                                                    },
                                                    data: {
                                                        currentQuantity: original_quantity
                                                    }
                                                })
                                            }
                                        )
                                    )
                                } catch (error) {
                                    throw new Error(
                                        'Có lỗi trong quá trình chạy cron_job để rollback sản phẩm khi tạo đơn hàng'
                                    )
                                }
                            })
                        } catch (error) {
                            console.log(':::::Lỗi rollback đặt hàng:::::', error)
                        }
                    })
                    rollback_job.runOnce = true
                    this.schedulerRegistry.addCronJob(productActionId, rollback_job)

                    let isHasVoucher = false
                    body.orders.forEach(({ voucherId }) => {
                        if (voucherId) {
                            isHasVoucher = true
                            return
                        }
                    })

                    if (isHasVoucher) {
                        this.store_client.emit(updateVoucherWhenCreatingOrder, {
                            user,
                            body,
                            productActionId
                        } as OrderPayload & { productActionId: string })
                    } else {
                        this.socket_client.emit(statusOfOrder, {
                            id: body.actionId,
                            msg: 'Đặt hàng thành công',
                            action: true,
                            result: null
                        })
                    }
                } catch (err) {
                    console.log(
                        '******Bước 2: Lỗi rollback khi cập nhật product ở THEN (LINE 775)********'
                    )
                }
            })
            .catch((err) => {
                try {
                    console.log(
                        '********Cập nhật số lượng sản phẩm khi đặt hàng thất bại********',
                        err
                    )
                    this.order_client.emit(rollbackOrder, body.actionId)
                    this.socket_client.emit(statusOfOrder, {
                        id: body.actionId,
                        msg: err?.message || 'Đặt hàng không thành công',
                        action: false,
                        result: null
                    })
                    let roll_back_job = this.schedulerRegistry.getCronJob(productActionId)
                    if (roll_back_job) {
                        roll_back_job.stop()
                        this.schedulerRegistry.deleteCronJob(productActionId)
                    }
                } catch (err) {
                    console.log(
                        '*****Bước 2: Lỗi rollback product ở bước try catch (LINE 795)*******'
                    )
                }
            })
    }

    async rollbackUpdateQuantityProduct(actionId: string, productActionId: string) {
        console.log('*******Tiến hành rollback (LINE 838)***********')
        try {
            this.order_client.emit(rollbackOrder, actionId)
            let update_quantity_product_job = this.schedulerRegistry.getCronJob(productActionId)
            if (update_quantity_product_job) {
                update_quantity_product_job.start()
            }
        } catch (err) {
            console.log(
                '*****Bước 2: rollback cập nhật số lượng từ voucher đến product bị lỗi (LINE 815) ********',
                err
            )
        }
    }

    async commitUpdateQuantityProduct(actionId: string, productActionId: string) {
        try {
            console.log('*********commit cập nhật lại product********')
            this.order_client.emit(commitOrder, actionId)
            let cron_job = this.schedulerRegistry.getCronJob(productActionId)
            if (cron_job) {
                cron_job.stop()
                this.schedulerRegistry.deleteCronJob(productActionId)
            }
        } catch (err) {
            console.log('******Bước 2: Lỗi commit product (LINE 829) *******')
        }
    }

    // async updateQuantity(productId: string, storeId: string, buy: number): Promise<Mess> {
    //     const hashValue = hash('product', productId)

    //     const fromCache = await this.cacheManager.get<string>(hashValue)

    //     if (fromCache) {
    //         const { quantity, priceAfter } = JSON.parse(fromCache) as {
    //             quantity: number
    //             priceAfter: number
    //         }
    //         if (quantity === buy) {
    //             await Promise.all([
    //                 this.cacheManager.set(
    //                     hashValue,
    //                     JSON.stringify({ quantity: 0, priceAfter }),
    //                     1000 * 60 * 5
    //                 ),
    //                 this.prisma.product.update({
    //                     where: {
    //                         id: productId
    //                     },
    //                     data: {
    //                         currentQuantity: 0
    //                     }
    //                 })
    //             ])
    //             this.emitUpdateProductToSocket(productId, 0, priceAfter)
    //             this.schedulerRegistry.deleteCronJob(hashValue)
    //             return {
    //                 msg: 'ok',
    //                 action: true,
    //                 result: null
    //             }
    //         }

    //         let remainingQuantity = quantity - buy

    //         await this.cacheManager.set(
    //             hashValue,
    //             JSON.stringify({ quantity: remainingQuantity, priceAfter } as {
    //                 quantity: number
    //                 priceAfter: number
    //             })
    //         )

    //         this.emitUpdateProductToSocket(productId, remainingQuantity, priceAfter)

    //         return {
    //             msg: 'ok',
    //             action: true,
    //             result: null
    //         }
    //     } else {
    //         const productExist = await this.prisma.product.findUnique({
    //             where: {
    //                 id: productId,
    //                 storeId
    //             }
    //         })

    //         if (!productExist) {
    //             throw new Error('Sản phẩm không tồn tại')
    //         }

    //         if (productExist.currentQuantity < buy) {
    //             throw new Error(`Sản phẩm ${productId} không đủ số lượng`)
    //         }

    //         if (productExist.currentQuantity === buy) {
    //             await Promise.all([
    //                 this.cacheManager.set(
    //                     hashValue,
    //                     JSON.stringify({
    //                         quantity: 0,
    //                         priceAfter: productExist.priceAfter
    //                     })
    //                 ),
    //                 this.prisma.product.update({
    //                     where: {
    //                         id: productId
    //                     },
    //                     data: {
    //                         currentQuantity: 0
    //                     }
    //                 })
    //             ])

    //             this.emitUpdateProductToSocket(productId, 0, productExist.priceAfter)

    //             return {
    //                 msg: 'ok',
    //                 action: true,
    //                 result: null
    //             }
    //         }

    //         let remainingQuantity = productExist.currentQuantity - buy

    //         await this.cacheManager.set(
    //             hashValue,
    //             JSON.stringify({ quantity: remainingQuantity, priceAfter: productExist.priceAfter })
    //         )

    //         this.emitUpdateProductToSocket(productId, remainingQuantity, productExist.priceAfter)

    //         const updateQuantityJob = new CronJob(CronExpression.EVERY_5_MINUTES, async () => {
    //             const [fromCache, productIn] = await Promise.all([
    //                 this.cacheManager.get<string>(hashValue),
    //                 this.prisma.product.findUnique({
    //                     where: {
    //                         id: productId
    //                     }
    //                 })
    //             ])
    //             let { quantity } = JSON.parse(fromCache) as { quantity: number; priceAfter: number }
    //             let tmp = []
    //             if (quantity === productIn.currentQuantity) {
    //                 tmp.push(this.cacheManager.del(hashValue))
    //             }
    //             await Promise.all([
    //                 this.prisma.product.update({
    //                     where: {
    //                         id: productId,
    //                         storeId
    //                     },
    //                     data: {
    //                         currentQuantity: quantity
    //                     }
    //                 }),
    //                 ...tmp
    //             ])

    //             if (tmp.length) {
    //                 this.schedulerRegistry.deleteCronJob(hashValue)
    //             }
    //         })

    //         this.schedulerRegistry.addCronJob(hashValue, updateQuantityJob)

    //         updateQuantityJob.start()

    //         return {
    //             msg: 'ok',
    //             action: true,
    //             result: null
    //         }
    //     }
    // }

    async updateQuantiyProductsWhenCancelOrder(payload: {
        storeId: string
        products: { productId: string; quantity: number }[]
    }): Promise<MessageReturn> {
        let { storeId, products } = payload
        let process = async (
            tx: Omit<
                PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
                '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
            >,
            productId: string,
            quantity: number
        ) => {
            try {
                let hashValue = hash('product', productId)
                let fromCache = await this.cacheManager.get<string>(hashValue)

                if (fromCache) {
                    let { quantity: quantityFromCache, priceAfter } = JSON.parse(fromCache) as {
                        quantity: number
                        priceAfter: number
                    }
                    await this.emitUpdateProductToSocket(
                        storeId,
                        productId,
                        quantity + quantityFromCache,
                        priceAfter
                    )
                    return {
                        msg: 'ok',
                        action: true,
                        result: null
                    }
                }
                return tx.product.update({
                    where: {
                        id: productId
                    },
                    data: {
                        currentQuantity: {
                            increment: quantity
                        }
                    }
                })
            } catch (err) {
                console.log('error process', err)
                Promise.reject('Lỗi cập nhật số lượng sản phẩm')
            }
        }

        try {
            await this.prisma.$transaction(async (tx) => {
                try {
                    await Promise.all(
                        products.map(({ productId, quantity }) => process(tx, productId, quantity))
                    )
                } catch (err) {
                    console.log('error transaction', err)
                    throw new Error('Lỗi Cập nhật sản phẩm')
                }
            })
            return {
                msg: 'ok',
                action: true,
                result: null
            }
        } catch (err) {
            console.log('error update all', err)
            await this.rollbackUpdateQuantityWhenCancelOrder({ storeId, products })
            return {
                msg: err?.message || 'Cập nhật lại số lượng sản phẩm không thành công',
                action: false,
                result: null
            }
        }
    }

    async rollbackUpdateQuantityWhenCancelOrder(payload: {
        storeId: string
        products: { productId: string; quantity: number }[]
    }) {
        let { products, storeId } = payload

        let rollback = async (
            tx: Omit<
                PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
                '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
            >,
            product: { quantity: number; productId: string }
        ) => {
            try {
                let { productId, quantity: buy } = product
                let hashValue = hash('product', productId)
                let fromCache = await this.cacheManager.get<string>(hashValue)
                if (fromCache) {
                    let { quantity: quantityFromCache, priceAfter } = JSON.parse(fromCache) as {
                        quantity: number
                        priceAfter: number
                    }
                    this.emitUpdateProductToSocket(
                        storeId,
                        productId,
                        quantityFromCache - 1,
                        priceAfter
                    )
                    return {
                        msg: 'ok',
                        action: true,
                        result: null
                    }
                }
                return tx.product.update({
                    where: {
                        id: productId
                    },
                    data: {
                        currentQuantity: {
                            decrement: buy
                        }
                    }
                })
            } catch (err) {
                console.log('rollback one', err)
                return Promise.reject('Lỗi rollback sản phẩm')
            }
        }

        try {
            await this.prisma.$transaction(async (tx) => {
                try {
                    await Promise.all(products.map((product) => rollback(tx, product)))
                } catch (err) {
                    throw new Error('Lỗi rollback sản phẩm')
                }
            })
        } catch (err) {
            console.log('rollback all', err)
            throw new Error('Lỗi rollback sản phẩm')
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
                this.cacheManager.get<string>(hash('product', id))
            ])

            if (!product) {
                return undefined
            }

            return {
                ...product,
                currentQuantity: cached ? JSON.parse(cached).quantity : product.currentQuantity
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
