import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class RefreshCartDTO {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  productsId: string[]
}
