import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateUserViewProductDto {
    @IsString()
    @IsOptional()
    userId?: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    storeId: string
}
