import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserAddProductToCartDTO {
  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsNotEmpty()
  productId: string

  @IsInt()
  @IsNotEmpty()
  quantity: number
}
