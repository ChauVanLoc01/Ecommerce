import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsString, IsUUID } from 'class-validator'

export class CreateUserViewProductDto {
  @ApiProperty({
    description: 'List of product identifiers',
    example: ['product1', 'product2', 'product3']
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one product must be specified' })
  @IsString({ each: true })
  products: string[]
}
