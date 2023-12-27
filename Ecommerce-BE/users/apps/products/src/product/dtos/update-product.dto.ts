/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEnum
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { Status } from 'common/enums/status.enum'

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

  @ApiPropertyOptional({
    enum: Status
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status
}

export type UpdateProductType = InstanceType<typeof UpdateProductDTO>
