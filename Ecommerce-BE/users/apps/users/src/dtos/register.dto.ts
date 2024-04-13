import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEmail, MaxLength } from 'class-validator'

export class RegisterDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  full_name: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string
}
