import { PaymentService } from './payment.service'
import { PaymentController } from './payment.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
