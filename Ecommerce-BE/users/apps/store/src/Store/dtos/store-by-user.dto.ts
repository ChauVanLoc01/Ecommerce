import { IsArray, IsNotEmpty, IsString } from 'class-validator'

export class StoreByUserDTO {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  storesId: string[]
}
