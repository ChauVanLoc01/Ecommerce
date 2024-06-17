import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'

export class ProductJoinPromotionDTO {
    @IsNotEmpty()
    @IsString()
    productId: string

    @IsNotEmpty()
    @IsInt()
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    priceAfter: number
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
