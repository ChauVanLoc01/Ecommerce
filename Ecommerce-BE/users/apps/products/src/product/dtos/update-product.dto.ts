/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { GreaterThanPrice } from 'common/decorators/greater-than-price.decorator'

export class UpdateProductDTO {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    category?: string

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    priceBefore?: number

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    priceAfter?: number

    @ApiPropertyOptional()
    @IsNumber()
    @IsOptional()
    initQuantity?: number

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    description?: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    status?: string
}

export type UpdateProductType = InstanceType<typeof UpdateProductDTO>
