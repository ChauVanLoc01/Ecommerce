import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateStatusOfUserDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    status?: string
}
