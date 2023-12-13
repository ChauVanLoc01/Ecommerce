import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ResetPasswordDTO {
  @ApiProperty({
    required: true
  })
  @IsInt()
  @IsNotEmpty()
  code: number
}

export type ResetPasswordType = InstanceType<typeof ResetPasswordDTO>
