import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsISO8601, IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from 'common/decorators/pagination.dto'

export class QueryGlobalVoucherDTO extends PaginationDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search_key?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    status?: string

    @ApiPropertyOptional()
    @IsISO8601()
    @IsOptional()
    start_date?: string

    @ApiPropertyOptional()
    @IsISO8601()
    @IsOptional()
    end_date?: string
}
