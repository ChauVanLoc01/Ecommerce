import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsISO8601, IsOptional, IsString } from 'class-validator'
import { PaginationDTO } from 'common/decorators/pagination.dto'

export class QueryAllUserProfileDTO extends PaginationDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    search_key?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    role?: string[]

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

export type QueryAllUserProfileType = InstanceType<typeof QueryAllUserProfileDTO>
