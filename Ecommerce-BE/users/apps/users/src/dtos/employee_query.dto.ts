import { IsDateString, IsEnum, IsOptional } from 'class-validator'
import { PaginationDTO } from 'common/decorators/pagination.dto'
import { Status } from 'common/enums/status.enum'

export class EmployeeQueryDTO extends PaginationDTO {
    @IsEnum(Status)
    @IsOptional()
    status?: Status

    @IsEnum(['desc', 'asc'])
    @IsOptional()
    createdAt?: 'desc' | 'asc'

    @IsDateString()
    @IsOptional()
    start_date?: Date

    @IsDateString()
    @IsOptional()
    end_date?: Date
}
