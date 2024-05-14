/* eslint-disable prettier/prettier */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator'
import { Status } from 'common/enums/status.enum'
export class CreateProductDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsInt()
  @IsOptional()
  priceBefore?: number

  @ApiPropertyOptional()
  @IsInt()
  @IsNotEmpty()
  priceAfter: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  initQuantity: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  category: string

  @ApiPropertyOptional({
    required: false,
    default: Status.ACTIVE
  })
  @IsEnum(Status)
  @IsOptional()
  status: Status.ACTIVE

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  productImages: string[]

  @IsUrl()
  @IsNotEmpty()
  imagePrimary: string
}

export type CreateProductType = InstanceType<typeof CreateProductDTO>
