/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsBoolean } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateCategoryDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    category_shortname : string

    @ApiProperty()
    @IsString()
    code: string


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsNumber()
    description: number

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    is_active?: number

   
}