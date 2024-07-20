import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class CreatePaymentDTO {
    @ApiProperty()
    @IsNumber()
    amount: number

    @ApiProperty()
    @IsString()
    bankCode: string
}
