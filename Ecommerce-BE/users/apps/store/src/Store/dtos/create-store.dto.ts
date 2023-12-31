import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateStoreDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary'
  })
  image: Express.Multer.File

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  location?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string
}

export type CreateStoreType = InstanceType<typeof CreateStoreDTO>
