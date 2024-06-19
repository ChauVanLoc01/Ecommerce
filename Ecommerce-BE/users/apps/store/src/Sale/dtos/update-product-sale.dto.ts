import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator'
import { ProductJoinPromotionDTO } from './create-product-sale.dto'

class UpdateProductSalePromotion extends PartialType(
    OmitType(ProductJoinPromotionDTO, ['productId'])
) {
    @IsString()
    @IsNotEmpty()
    productPromotionId: string

    @ApiPropertyOptional()
    @IsBoolean()
    @IsOptional()
    isDelete?: boolean
}

export class UpdateProductsSalePromotion {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateProductSalePromotion)
    productPromotions: UpdateProductSalePromotion[]
}
