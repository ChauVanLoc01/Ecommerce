import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'
import { CreateRatingMaterialDto } from './rating-relatived.dto'

export class CreateRatingDto extends CreateRatingMaterialDto {
    @ApiProperty({ description: 'Unique identifier for the order', example: 'order-123' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    orderId: string

    @ApiProperty({ description: 'Rating stars', example: 4.5 })
    @IsNumber()
    @IsNotEmpty()
    stars: number

    @ApiProperty({
        description: 'Detail of the rating',
        example: 'I really liked this product because...'
    })
    @IsString()
    @IsNotEmpty()
    comment: string
}
