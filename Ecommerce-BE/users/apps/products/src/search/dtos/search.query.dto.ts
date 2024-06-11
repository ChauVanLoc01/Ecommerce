import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator'

export class SearchProductQueryDTO {
  @IsString()
  @IsNotEmpty()
  search: string

  @IsString()
  @IsNotEmpty()
  scroll: string
}
