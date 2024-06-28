import { PrismaService } from '@app/common/prisma/prisma.service'
import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { getProductBySalePromotion } from 'common/constants/event.constant'
import { PaginationDTO } from 'common/decorators/pagination.dto'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { add, endOfHour, startOfDay } from 'date-fns'
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
            const promotions = await this.prisma.salePromotion.findMany({
                where: {
                    startDate: {
                        gte: startOfDay(add(date, { days: 1 }))
                    }
                }
            })

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
                        createdBy: userId
                    }
                })
            )
        )

        return {
            msg: 'ok',
            result
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

    async getAllProduct(promotionId: string, pagination: PaginationDTO) {
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

            const products = await this.prisma.productPromotion.findMany({
                where: {
                    storePromotionId: promotionId,
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
                    result: []
                }
            }

            const productDetails = await firstValueFrom<MessageReturn>(
                this.productClient.send(
                    getProductBySalePromotion,
                    products.map((product) => product.productId)
                )
            )

            if (!productDetails.action) {
                throw new Error(productDetails.msg)
            }

            return {
                msg: 'ok',
                result: {
                    sale: promotionExist,
                    productSales: products,
                    productDetails: productDetails.result
                }
            }
        } catch (err) {
            throw new InternalServerErrorException('Lỗi Server')
        }
    }
}
