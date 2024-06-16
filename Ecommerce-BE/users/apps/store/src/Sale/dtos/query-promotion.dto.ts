import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsNotEmpty, IsString } from 'class-validator'

export class QuerySalePromotionDTO {
    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    date: string
}
