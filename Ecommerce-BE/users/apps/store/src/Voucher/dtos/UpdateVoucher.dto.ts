import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'
import { Status } from 'common/enums/status.enum'

export class UpdateVoucherDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  code?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  initQuantity: number

  @ApiPropertyOptional({
    type: 'Enum'
  })
  @IsEnum(['ACTIVE', 'BLOCK', 'HIDDEN'])
  @IsOptional()
  status: Status

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  percent: number

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  maximum: number

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  totalMin?: number

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  priceMin?: number

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string
}
