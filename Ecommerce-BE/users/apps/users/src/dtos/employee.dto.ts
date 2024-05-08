import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class CreateEmployee {
  @IsString()
  @IsNotEmpty()
  full_name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  password: string
}
