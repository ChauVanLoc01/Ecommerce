import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator'
import { GreaterThanPrice } from 'common/decorators/greater-than-price.decorator'
import { GreaterThanDate } from 'common/decorators/greater_than_date.decorator'
import { PaginationDTO } from 'common/decorators/pagination.dto'

export class QueryProductDTO extends PaginationDTO {
  @ApiPropertyOptional({
    enum: ['asc', 'desc']
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  createdAt?: 'asc' | 'desc'

  @ApiPropertyOptional({
    enum: ['asc', 'desc']
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  sell?: 'asc' | 'desc'

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  price_min?: number

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @GreaterThanPrice('price_min')
  @IsOptional()
  price_max?: number

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  start_date?: Date

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  @GreaterThanDate('start_date')
  end_date?: Date
}

export type QueryProductType = InstanceType<typeof QueryProductDTO>
