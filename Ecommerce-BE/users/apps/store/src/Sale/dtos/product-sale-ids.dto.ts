import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class ProductSaleIds {
    @ApiProperty()
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    productIds: string[]
}
