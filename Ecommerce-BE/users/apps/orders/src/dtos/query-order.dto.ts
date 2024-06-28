import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator'
import { GreaterThanDate } from 'common/decorators/greater_than_date.decorator'
import { PaginationDTO } from 'common/decorators/pagination.dto'
import { OrderStatus } from 'common/enums/orderStatus.enum'
import { Status } from 'common/enums/status.enum'

export class QueryOrderDTO extends PaginationDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    product_name?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    orderId?: string

    @ApiPropertyOptional()
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus

    @ApiPropertyOptional({
        enum: ['asc', 'desc'],
        required: false
    })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    createdAt?: 'asc' | 'desc'

    @ApiPropertyOptional({
        enum: ['asc', 'desc'],
        required: false
    })
    @IsEnum(['asc', 'desc'])
    @IsOptional()
    total?: 'asc' | 'desc'

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

export type QueryOrderType = InstanceType<typeof QueryOrderDTO>
