import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreatePaymentDTO {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    amount: number

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    bankCode: string
}
