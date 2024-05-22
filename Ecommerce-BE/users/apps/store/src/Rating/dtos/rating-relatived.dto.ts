import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'

class Material {
  @IsString()
  @IsNotEmpty()
  url: string

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean
}

export class CreateRatingMaterialDto {
  @ApiProperty({
    description: 'URL of the rating material',
    example: 'http://example.com/image.jpg'
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Material)
  urls: Material[]
}
