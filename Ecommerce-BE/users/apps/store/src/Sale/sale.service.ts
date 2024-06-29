import { PrismaService } from '@app/common/prisma/prisma.service'
import {
    BadRequestException,
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { getProductImageByProductSalePromotion } from 'common/constants/event.constant'
import { PaginationDTO } from 'common/decorators/pagination.dto'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { add, endOfHour, startOfHour } from 'date-fns'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateProductSalePromotionDTO } from './dtos/create-product-sale.dto'
import { QuerySalePromotionDTO } from './dtos/query-promotion.dto'
import { UpdateProductsSalePromotion } from './dtos/update-product-sale.dto'

@Injectable()
export class SaleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @Inject('PRODUCT_SERVICE') private productClient: ClientProxy
    ) {}

    async getSalePromotionDetail(storePromotionId: string): Promise<Return> {
        const storePromotion = await this.prisma.storePromotion.findUnique({
            where: {
                id: storePromotionId
            }
        })

        if (!storePromotion) {
            throw new BadRequestException('Cửa hàng chưa tham gia sự kiện này')
        }

        const productPromotions = await this.prisma.productPromotion.findMany({
            where: {
                storePromotionId: storePromotion.id
            }
        })

        return {
            msg: 'ok',
            result: productPromotions
        }
    }

    async getSalePromotion(user: CurrentStoreType, query: QuerySalePromotionDTO): Promise<Return> {
        try {
            const { storeId } = user
            const { date } = query
            const promotions = await this.prisma.salePromotion.findMany({})

            const storePromotions = (
                await Promise.all(
                    promotions.map((promotion) =>
                        this.prisma.storePromotion.findFirst({
                            where: {
                                salePromotionId: promotion.id,
                                storeId
                            },
                            include: {
                                ProductPromotion: {
                                    where: {
                                        isDelete: false
                                    }
                                }
                            }
                        })
                    )
                )
            ).filter(Boolean)

            return {
                msg: 'ok',
                result: {
                    promotions,
                    storePromotions
                }
            }
        } catch (err) {
            throw new InternalServerErrorException('Lỗi Server')
        }
    }

    async addingProduct(
        user: CurrentStoreType,
        body: CreateProductSalePromotionDTO
    ): Promise<Return> {
        try {
            const { userId, storeId } = user
            const { salePromotionId, products, storePromotionId } = body

            let id = uuidv4()

            if (!storePromotionId) {
                await this.prisma.storePromotion.create({
                    data: {
                        id,
                        salePromotionId,
                        storeId,
                        createdAt: new Date(),
                        status: Status.ACTIVE,
                        createdBy: userId
                    }
                })
            }

            const result = await Promise.all(
                products.map(({ priceAfter, productId, quantity }) =>
                    this.prisma.productPromotion.create({
                        data: {
                            id: uuidv4(),
                            storePromotionId: storePromotionId || id,
                            productId,
                            isDelete: false,
                            createdAt: new Date(),
                            priceAfter,
                            quantity,
                            createdBy: userId,
                            salePromotionId
                        }
                    })
                )
            )

            return {
                msg: 'ok',
                result
            }
        } catch (err) {
            throw new InternalServerErrorException(err.message)
        }
    }

    async updateProduct(
        user: CurrentStoreType,
        body: UpdateProductsSalePromotion
    ): Promise<Return> {
        const { productPromotions } = body

        const result = await Promise.all(
            productPromotions.map(({ productPromotionId, isDelete, priceAfter, quantity }) =>
                this.prisma.productPromotion.update({
                    where: {
                        id: productPromotionId
                    },
                    data: {
                        quantity,
                        priceAfter,
                        isDelete,
                        updatedAt: new Date(),
                        updatedBy: user.userId
                    }
                })
            )
        )

        return {
            msg: 'ok',
            result
        }
    }

    async getAllProduct(store: CurrentStoreType, promotionId: string, pagination: PaginationDTO) {
        try {
            const { limit, page } = pagination

            let take = limit || this.configService.get<number>('app.limit_default') || 10

            const promotionExist = await this.prisma.salePromotion.findUnique({
                where: {
                    id: promotionId,
                    status: Status.ACTIVE,
                    startDate: {
                        gte: endOfHour(new Date())
                    }
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    startDate: true,
                    endDate: true,
                    type: true
                }
            })

            if (!promotionExist) {
                throw new BadRequestException('Chương trình giảm giá không tồn tại')
            }

            const storePromotion = await this.prisma.storePromotion.findFirst({
                where: {
                    storeId: store.storeId
                }
            })

            if (!storePromotion) {
                return {
                    msg: 'ok',
                    result: {
                        sale: promotionExist,
                        productSales: []
                    }
                }
            }

            const products = await this.prisma.productPromotion.findMany({
                where: {
                    storePromotionId: storePromotion.id,
                    isDelete: false,
                    quantity: {
                        gt: 0
                    }
                },
                take,
                skip: take * (page - 1),
                select: {
                    id: true,
                    priceAfter: true,
                    productId: true,
                    quantity: true
                }
            })

            if (!products.length) {
                return {
                    msg: 'ok',
                    result: {
                        sale: promotionExist,
                        productSales: []
                    }
                }
            }

            return {
                msg: 'ok',
                result: {
                    sale: promotionExist,
                    productSales: products
                }
            }
        } catch (err) {
            throw new InternalServerErrorException(err.message)
        }
    }

    async getSalePromotionsInDay() {
        try {
            let current = startOfHour(new Date())

            const saleIds = await this.prisma.salePromotion.findMany({
                where: {
                    startDate: {
                        gte: current
                    },
                    endDate: add(current, { hours: 24 })
                },
                orderBy: {
                    startDate: 'asc'
                }
            })

            if (!saleIds.length) {
                return {
                    msg: 'ok',
                    data: []
                }
            }

            return {
                msg: 'ok',
                data: saleIds
            }
        } catch (err) {
            throw new InternalServerErrorException('Lỗi Server')
        }
    }

    async getCurrentSale() {
        try {
            const current = add(startOfHour(new Date()), { hours: 7 })

            const salePromotion = await this.prisma.salePromotion.findFirst({
                where: {
                    startDate: {
                        gte: current
                    },
                    endDate: {
                        equals: add(current, { hours: 1 })
                    }
                },
                omit: {
                    createdAt: true,
                    createdBy: true,
                    updatedAt: true,
                    updatedBy: true,
                    status: true
                }
            })

            const products = await this.prisma.productPromotion.findMany({
                where: {
                    salePromotionId: salePromotion.id,
                    isDelete: false,
                    quantity: {
                        gt: 0
                    }
                },
                select: {
                    id: true,
                    productId: true,
                    quantity: true,
                    priceAfter: true,
                    storePromotionId: true,
                    salePromotionId: true
                },
                take: 20
            })

            if (!products.length) {
                return {
                    msg: 'ok',
                    result: {
                        salePromotion,
                        productPromotions: []
                    }
                }
            }

            const productInfors = await firstValueFrom<
                MessageReturn<{ name: string; image: string }[]>
            >(
                this.productClient.send(
                    getProductImageByProductSalePromotion,
                    products.map((e) => e.productId)
                )
            )

            if (!productInfors.action) {
                throw new BadRequestException(productInfors.msg)
            }

            return {
                msg: 'ok',
                result: {
                    salePromotion,
                    productPromotions: products.map((e, idx) => ({
                        ...e,
                        name: productInfors.result[idx].name,
                        image: productInfors.result[idx].image
                    }))
                }
            }
        } catch (err) {
            console.log('error', err)
            throw new HttpException(err.message || 'Lỗi Server', err.status || 500)
        }
    }
}
