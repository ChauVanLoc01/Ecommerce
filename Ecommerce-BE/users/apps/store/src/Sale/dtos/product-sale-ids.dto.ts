import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CartDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    storeId: string

    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    productIds: string[]
}

export class ProductSaleIds {
    @ApiProperty()
    @IsArray()
    @Type(() => CartDTO)
    @IsNotEmpty()
    ids: CartDTO[]
}
