import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength
} from 'class-validator'

export class SendOtpDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  new_password: string
}

export type SendOtpType = InstanceType<typeof SendOtpDTO>
