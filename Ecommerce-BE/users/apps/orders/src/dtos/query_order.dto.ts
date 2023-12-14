import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsDate, IsInt, IsOptional, IsString } from "class-validator"
import { PaginationDTO } from "common/decorators/pagination.dto"

export class QueryOrderDTO extends PaginationDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search?: string

    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    minTotal?: number

    @ApiPropertyOptional()
    @IsInt()
    @IsOptional()
    maxTotal?: number

    @ApiPropertyOptional()
    @IsDate()
    @IsOptional()
    startDate?: Date

    @ApiPropertyOptional()
    @IsDate()
    @IsOptional()
    endDate?: Date
}

export type QueryOrderType = InstanceType<typeof QueryOrderDTO>