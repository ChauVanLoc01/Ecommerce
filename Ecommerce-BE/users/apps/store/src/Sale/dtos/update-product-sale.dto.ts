import { OmitType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { ProductJoinPromotionDTO } from './create-product-sale.dto'

class UpdateProductSalePromotion extends OmitType(ProductJoinPromotionDTO, ['productId']) {
    @IsString()
    @IsNotEmpty()
    productPromotionId: string
}

export class UpdateProductsSalePromotion {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateProductSalePromotion)
    productPromotions: UpdateProductSalePromotion[]
}
