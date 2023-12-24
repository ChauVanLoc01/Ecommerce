/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator"
import { ApiProperty, PartialType } from "@nestjs/swagger"
import { CreateProductDTO } from './create-product.dto';

export class UpdateProductDTO {
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
export class UpdateProductDto extends PartialType(CreateProductDTO) {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    productImage: string;
  }