import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { OrderParameter } from 'common/types/order-parameter.type'

export class CreateOrderDTO {
  @ApiProperty({
    type: [String]
  })
  @IsArray()
  @IsNotEmpty()
  orderParameters: OrderParameter[]

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  voucherId?: string

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  score?: number
}

export type CreateOrderType = InstanceType<typeof CreateOrderDTO>
