import { ApiProperty } from '@nestjs/swagger'
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class SearchCodeDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @IsNotEmpty()
  storesID: string[]
}
