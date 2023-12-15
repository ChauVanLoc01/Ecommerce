import { ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsDate,
  IsEmail,
  IsInt,
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
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional()
  @IsDate()
  @IsOptional()
  birthday?: Date

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  status?: number
}

export type UpdateUserProfileType = InstanceType<typeof UpdateUserProfileDTO>
