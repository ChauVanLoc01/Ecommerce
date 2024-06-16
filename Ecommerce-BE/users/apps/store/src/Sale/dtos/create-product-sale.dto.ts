import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator'

export class ProductJoinPromotionDTO {
    @IsNotEmpty()
    @IsString()
    productId: string

    @IsNotEmpty()
    @IsInt()
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    priceBefore: number

    @IsNotEmpty()
    @IsNumber()
    priceAfter: number

    @IsOptional()
    @IsBoolean()
    isDelete: boolean
}

export class CreateProductSalePromotionDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    salePromotionId: string

    @ApiProperty()
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductJoinPromotionDTO)
    products: ProductJoinPromotionDTO[]
}
