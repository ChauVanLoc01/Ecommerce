import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateReplyRatingDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    parentRatingId: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    detail: string
}
