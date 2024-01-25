/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class ChangePasswordDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  current_password: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  new_password: string
}

export type ChangePasswordType = InstanceType<typeof ChangePasswordDTO>
