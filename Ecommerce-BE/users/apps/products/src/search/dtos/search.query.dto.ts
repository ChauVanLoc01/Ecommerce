import { IsNotEmpty, IsString } from 'class-validator'

export class SearchProductQueryDTO {
  @IsString()
  @IsNotEmpty()
  search: string
}
