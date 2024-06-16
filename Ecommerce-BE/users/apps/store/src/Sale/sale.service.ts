import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { CurrentStoreType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { add } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { CreateProductSalePromotionDTO } from './dtos/create-product-sale.dto'
import { UpdateProductSalePromotion } from './dtos/update-product-sale.dto'

@Injectable()
export class SaleService {
    constructor(private readonly prisma: PrismaService) {}

    async addingProduct(
        user: CurrentStoreType,
        body: CreateProductSalePromotionDTO
    ): Promise<Return> {
        const { userId } = user
        const { priceAfter, priceBefore, productIds, quantity, salePromotionId } = body

        const result = await Promise.all(
            productIds.map((productId) =>
                this.prisma.productPromotion.create({
                    data: {
                        id: uuidv4(),
                        salePromotionId,
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

    async updateProduct(user: CurrentStoreType, body: UpdateProductSalePromotion): Promise<Return> {
        const { userId } = user
        const { isDelete, productId, priceAfter, priceBefore, quantity, salePromotionId } = body

        const result = await this.prisma.productPromotion.update({
            where: {
                id: salePromotionId,
                productId
            },
            data: {
                quantity,
                priceAfter,
                priceBefore,
                isDelete,
                updatedAt: add(new Date(), { hours: 7 }),
                updatedBy: userId
            }
        })

        return {
            msg: 'ok',
            result
        }
    }
}
