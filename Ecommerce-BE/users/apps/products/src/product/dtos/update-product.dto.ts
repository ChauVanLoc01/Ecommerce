/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'

export class UpdateProductDTO {
  @ApiPropertyOptional({
    required: false,
    type: 'string',
    format: 'binary'
  })
  image?: Express.Multer.File

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  priceBefore?: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  priceAfter?: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  currentQuantity?: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsEnum([0, 1])
  @IsOptional()
  status?: 0 | 1
}

export type UpdateProductType = InstanceType<typeof UpdateProductDTO>
