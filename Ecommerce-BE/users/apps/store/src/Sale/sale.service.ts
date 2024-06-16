import { PrismaService } from '@app/common/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { add, endOfDay } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { CreateProductSalePromotionDTO } from './dtos/create-product-sale.dto'
import { QuerySalePromotionDTO } from './dtos/query-promotion.dto'
import { UpdateProductsSalePromotion } from './dtos/update-product-sale.dto'

@Injectable()
export class SaleService {
    constructor(private readonly prisma: PrismaService) {}

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
        const { storeId } = user
        const { date } = query

        const promotions = await this.prisma.salePromotion.findMany({
            where: {
                startDate: date,
                endDate: add(endOfDay(date), { hours: 7 })
            }
        })

        const storePromotions = await Promise.all(
            promotions.map((promotion) =>
                this.prisma.storePromotion.findFirst({
                    where: {
                        salePromotionId: promotion.id,
                        storeId
                    }
                })
            )
        )

        return {
            msg: 'ok',
            result: {
                promotions,
                storePromotions
            }
        }
    }

    async addingProduct(
        user: CurrentStoreType,
        body: CreateProductSalePromotionDTO
    ): Promise<Return> {
        const { userId, storeId } = user
        const { salePromotionId, products } = body

        const storePromotion = await this.prisma.storePromotion.create({
            data: {
                id: uuidv4(),
                salePromotionId,
                storeId,
                createdAt: add(new Date(), { hours: 7 }),
                status: Status.ACTIVE,
                createdBy: userId
            }
        })

        const result = await Promise.all(
            products.map(({ priceAfter, priceBefore, productId, quantity }) =>
                this.prisma.productPromotion.create({
                    data: {
                        id: uuidv4(),
                        storePromotionId: storePromotion.id,
                        productId,
                        isDelete: false,
                        createdAt: add(new Date(), { hours: 7 }),
                        priceAfter,
                        priceBefore,
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

    async updateProduct(body: UpdateProductsSalePromotion): Promise<Return> {
        const { productPromotions } = body

        const result = await Promise.all(
            productPromotions.map(({ productPromotionId, ...data }) =>
                this.prisma.productPromotion.update({
                    where: {
                        id: productPromotionId
                    },
                    data
                })
            )
        )

        return {
            msg: 'ok',
            result
        }
    }
}
