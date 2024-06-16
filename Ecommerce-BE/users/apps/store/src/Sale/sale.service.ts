import { Injectable } from '@nestjs/common'
import { CurrentStoreType } from 'common/types/current.type'
import { CreateProductSalePromotionDTO } from './dtos/create-product-sale.dto'
import { UpdateProductSalePromotion } from './dtos/update-product-sale.dto'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { v4 as uuidv4 } from 'uuid'
import { add } from 'date-fns'

@Injectable()
export class SaleService {
    constructor(private readonly prisma: PrismaService) {}

    async addingProduct(user: CurrentStoreType, body: CreateProductSalePromotionDTO) {
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
    }

    updateProduct(user: CurrentStoreType, body: UpdateProductSalePromotion) {}
}
