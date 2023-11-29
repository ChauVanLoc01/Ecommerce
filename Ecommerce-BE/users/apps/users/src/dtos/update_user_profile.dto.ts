import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDate,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength
} from 'class-validator'

export class UpdateUserProfileDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @MaxLength(50)
  full_name?: string

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  birthday?: Date

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string
}

export type UpdateUserProfileType = InstanceType<typeof UpdateUserProfileDTO>
