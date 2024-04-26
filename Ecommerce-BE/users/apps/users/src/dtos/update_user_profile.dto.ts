import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsISO8601, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'

export class UpdateUserProfileDTO {
  @IsUrl()
  @IsOptional()
  image?: string

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
  @IsISO8601()
  @IsOptional()
  birthday?: string

  @ApiPropertyOptional()
  @IsEmail()
  @IsOptional()
  email?: string
}

export type UpdateUserProfileType = InstanceType<typeof UpdateUserProfileDTO>
