import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'
import { GreaterThanDate } from 'common/decorators/greater_than_date.decorator'
import { PaginationDTO } from 'common/decorators/pagination.dto'

export class RatingQueryDTO extends PaginationDTO {
  @ApiPropertyOptional()
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  createdAt?: 'asc' | 'desc'

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  reply?: boolean

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  @GreaterThanDate('startDate')
  endDate?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  replier?: string
}
