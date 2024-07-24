import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { GreaterThanPrice } from 'common/decorators/greater-than-price.decorator'
import { GreaterThanDate } from 'common/decorators/greater_than_date.decorator'
import { PaginationDTO } from 'common/decorators/pagination.dto'

export class QueryProductDTO extends PaginationDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search_key?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    category?: string

    @ApiPropertyOptional({
        enum: ['ACTIVE', 'BLOCK']
    })
    @IsEnum(['ACTIVE', 'BLOCK'])
    @IsOptional()
    status?: 'ACTIVE' | 'BLOCK'

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
    sold?: 'asc' | 'desc'

    @ApiPropertyOptional({
        enum: ['asc', 'desc']
    })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    price?: 'asc' | 'desc'

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

    @IsDateString()
    @IsOptional()
    min_date?: string

    @IsDateString()
    @IsOptional()
    max_date?: string
}

export type QueryProductType = InstanceType<typeof QueryProductDTO>
