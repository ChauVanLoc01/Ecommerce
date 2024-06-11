import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class ScrollInfinityDTO {
  @IsString()
  @IsOptional()
  scroll_id?: string

  @IsString()
  @IsNotEmpty()
  scroll: string

  @IsString()
  @IsNotEmpty()
  query: string
}
