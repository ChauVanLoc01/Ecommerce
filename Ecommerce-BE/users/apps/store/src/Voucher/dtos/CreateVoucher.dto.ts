import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'
import { Status } from 'common/enums/status.enum'

export class CreateVoucherDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code?: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  initQuantity: number

  @ApiProperty({
    type: 'Enum'
  })
  @IsEnum(['ACTIVE', 'BLOCK', 'HIDDEN'])
  @IsNotEmpty()
  status: Status

  @ApiProperty({
    type: 'Enum'
  })
  @IsEnum(['STORE', 'GLOBAL'])
  @IsNotEmpty()
  type: 'STORE' | 'GLOBAL'

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  percent: number

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
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

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string
}
