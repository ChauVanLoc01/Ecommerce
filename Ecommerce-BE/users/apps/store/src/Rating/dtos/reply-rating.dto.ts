import { ApiProperty } from "@nestjs/swagger";
import { CreateRatingMaterialDto } from "./rating-relatived.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateReplyRatingDTO extends CreateRatingMaterialDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    ratingId: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    detail: string
}