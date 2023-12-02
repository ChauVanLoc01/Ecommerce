import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateOrderDTO {
    @ApiProperty()
    @IsArray()
    @IsNotEmpty()
    products: string[]

    @ApiPropertyOptional()
    @IsString()
    addressId?: string

    @ApiPropertyOptional()
    @IsString()
    voucherId?: string

    @ApiPropertyOptional()
    @IsInt()
    score?: number
}

export type CreateOrderType = InstanceType<typeof CreateOrderDTO>