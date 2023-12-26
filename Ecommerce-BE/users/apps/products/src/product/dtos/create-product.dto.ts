/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
export class CreateProductDTO {
  @ApiProperty({
    required: true,
    type: 'string',
    format: 'binary'
  })
  @IsNotEmpty()
  image: Express.Multer.File

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
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
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string
}

export type CreateProductType = InstanceType<typeof CreateProductDTO>
