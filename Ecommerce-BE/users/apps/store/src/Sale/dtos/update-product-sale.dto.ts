import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { CreateProductSalePromotionDTO } from './create-product-sale.dto'

export class UpdateProductSalePromotion extends PartialType(
    OmitType(CreateProductSalePromotionDTO, ['productIds'])
) {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    productId: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isDelete: boolean
}
