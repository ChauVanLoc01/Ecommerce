import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator'

class ProductOrder {
    @IsString()
    @IsNotEmpty()
    productId: string

    @IsNumber()
    @IsOptional()
    priceBefore?: number

    @IsNumber()
    @IsNotEmpty()
    priceAfter: number

    @IsInt()
    @IsNotEmpty()
    quantity: number

    @IsBoolean()
    @IsOptional()
    isSale?: boolean
}

export class OrderDetail {
    @IsString()
    @IsNotEmpty()
    storeId: string

    @IsString()
    @IsOptional()
    voucherId: string

    @IsString()
    @IsOptional()
    note?: string

    @IsNumber()
    @IsNotEmpty()
    total: number

    @IsNumber()
    @IsNotEmpty()
    discount: number

    @IsNumber()
    @IsNotEmpty()
    pay: number

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductOrder)
    @IsNotEmpty()
    productOrders: ProductOrder[]
}

export class OrderDeliveryDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address: string
}

export class CreateOrderDTO {
    @ApiProperty({
        type: [String]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderDetail)
    @IsNotEmpty()
    orders: OrderDetail[]

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    globalVoucherId: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    actionId: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    currentSaleId?: string

    @ApiProperty()
    @IsObject({ each: true })
    @Type(() => OrderDeliveryDTO)
    delivery_info: OrderDeliveryDTO
}

export type CreateOrder = InstanceType<typeof CreateOrderDTO>
