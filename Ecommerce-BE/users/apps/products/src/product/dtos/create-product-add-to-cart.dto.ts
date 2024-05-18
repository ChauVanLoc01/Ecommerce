import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CreateUserAddProductToCartDTO {
  @IsString()
  @IsNotEmpty()
  productId: string

  @IsInt()
  @IsNotEmpty()
  quantity: number
}
