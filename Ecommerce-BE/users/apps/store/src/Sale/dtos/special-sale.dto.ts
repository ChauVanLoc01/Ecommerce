import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateSpecialSaleDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    start_date: string

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    end_date: string
}
