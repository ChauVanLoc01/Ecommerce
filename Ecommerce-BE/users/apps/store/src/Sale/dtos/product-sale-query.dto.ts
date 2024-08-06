import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from 'common/decorators/pagination.dto'

export class ProductSaleQuery extends PaginationDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    category?: string
}
