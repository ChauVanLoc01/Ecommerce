import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { CreateRatingMaterialDto } from './rating-relatived.dto'

export class CreateReplyRatingDTO extends CreateRatingMaterialDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    parentRatingId: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    detail: string
}
