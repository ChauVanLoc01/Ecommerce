import { PrismaService } from '@app/common/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

@Module({
    imports: [],
    controllers: [PaymentController],
    providers: [PaymentService, PrismaService]
})
export class PaymentModule {}
