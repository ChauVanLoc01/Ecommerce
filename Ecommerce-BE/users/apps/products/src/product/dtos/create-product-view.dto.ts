import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateUserViewProductDto {
  @IsString()
  @IsOptional()
  userId?: string

  @ApiProperty({
    description: 'List of product identifiers',
    example: ['product1', 'product2', 'product3']
  })
  @IsString()
  @IsNotEmpty()
  productId: string
}
