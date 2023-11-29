/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
export class CreateProductDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string

    @ApiProperty()
    @IsString()
    code: string


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsNumber()
    priceBefore: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    priceAfter: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    initQuantity: number

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    currentQuantity: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    description: string
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    status: string

   
}