import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'

export class CreateProductSalePromotionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  salePromotionId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  productIds: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  quantity: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  priceBefore: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  priceAfter: number
}
