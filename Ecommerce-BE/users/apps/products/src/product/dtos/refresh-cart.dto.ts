import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class CartDTO {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    productIds: string[]

    @IsString()
    @IsNotEmpty()
    storeId: string
}

export class RefreshCartDTO {
    @ApiProperty()
    @IsArray()
    @Type(() => CartDTO)
    ids: CartDTO[]
}
