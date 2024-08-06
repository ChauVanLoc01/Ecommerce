import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    ValidateNested
} from 'class-validator'

export class ProductJoinPromotionDTO {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    productId: string

    @IsNotEmpty()
    @IsInt()
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    priceAfter: number

    @IsNotEmpty()
    @IsUrl()
    image: string

    @IsString()
    @IsNotEmpty()
    category: string
}

export class CreateProductSalePromotionDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    salePromotionId: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    storePromotionId?: string

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductJoinPromotionDTO)
    products: ProductJoinPromotionDTO[]
}
