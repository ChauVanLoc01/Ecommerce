import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'
import { GreaterThanDate } from 'common/decorators/greater_than_date.decorator'
import { PaginationDTO } from 'common/decorators/pagination.dto'

export class VoucherQueryDTO extends PaginationDTO {
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
  @IsEnum(['ACTIVE', 'BLOCK'])
  @IsOptional()
  status?: 'ACTIVE' | 'BLOCK'

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  code?: string

  @ApiPropertyOptional({
    enum: ['asc', 'desc']
  })
  @IsEnum(['asc', 'desc'])
  @IsOptional()
  createdAt?: 'asc' | 'desc'
}
