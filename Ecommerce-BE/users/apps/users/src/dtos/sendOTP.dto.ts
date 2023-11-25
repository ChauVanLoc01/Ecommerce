import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsInt, IsNotEmpty } from 'class-validator'

export class SendOtpDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  otp: number
}

export type SendOtpType = InstanceType<typeof SendOtpDTO>
