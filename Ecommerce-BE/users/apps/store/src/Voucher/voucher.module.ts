import { PrismaService } from '@app/common/prisma/prisma.service'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { BackgroundName } from 'common/constants/background-job.constant'
import { VoucherConsummer } from '../worker/voucher.worker'
import { VoucherController } from './voucher.controller'
import { VoucherService } from './voucher.service'

@Module({
    imports: [
        BullModule.registerQueue({
            name: BackgroundName.voucher
        })
    ],
    controllers: [VoucherController],
    providers: [VoucherService, PrismaService, JwtService, VoucherConsummer]
})
export class VoucherModule {}
