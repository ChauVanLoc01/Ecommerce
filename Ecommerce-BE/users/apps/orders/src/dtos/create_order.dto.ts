import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

class Parameter {
  @IsString()
  @IsNotEmpty()
  productId: string

  @IsNumber()
  @IsOptional()
  price_before?: number

  @IsNumber()
  @IsNotEmpty()
  price_after: number

  @IsInt()
  @IsNotEmpty()
  quantity: number
}

class OrdersParameter {
  @IsString()
  @IsNotEmpty()
  storeId: string

  @IsString()
  @IsOptional()
  note?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Parameter)
  @IsNotEmpty()
  orders: Parameter[]
}

export class CreateOrderDTO {
  @ApiProperty({
    type: [String]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrdersParameter)
  @IsNotEmpty()
  orderParameters: OrdersParameter[]

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deliveryInformationId?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  voucherId?: string
}

export type CreateOrderType = InstanceType<typeof CreateOrderDTO>
