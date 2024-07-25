import { Body, Controller, Post, Req, Res } from '@nestjs/common'
import { Request, Response } from 'express'
import { CreatePaymentDTO } from '../dtos/payment.dto'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    createTransaction(@Req() req: Request, @Res() res: Response, @Body() body: CreatePaymentDTO) {
        return this.paymentService.createTransaction(req, res, body)
    }
}
