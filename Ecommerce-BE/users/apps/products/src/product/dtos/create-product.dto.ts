/* eslint-disable prettier/prettier */
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Status } from 'common/enums/status.enum'
export class CreateProductDTO {
  @ApiProperty({
    required: true,
    type: 'string',
    format: 'binary'
  })
  @IsNotEmpty()
  image: Express.Multer.File

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  priceBefore: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  priceAfter?: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  initQuantity: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    required: false,
    default: Status.ACCESS
  })
  @IsEnum(Status)
  @IsOptional()
  status: Status.ACCESS
}

export type CreateProductType = InstanceType<typeof CreateProductDTO>
