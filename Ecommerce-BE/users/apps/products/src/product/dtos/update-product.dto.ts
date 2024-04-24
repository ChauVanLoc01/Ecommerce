/* eslint-disable prettier/prettier */
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { GreaterThanPrice } from 'common/decorators/greater-than-price.decorator'
import { Status } from 'common/enums/status.enum'

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
  @GreaterThanPrice('priceAfter')
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

  @ApiPropertyOptional({
    enum: Status
  })
  @IsEnum(Status)
  @IsOptional()
  status?: Status
}

export type UpdateProductType = InstanceType<typeof UpdateProductDTO>
