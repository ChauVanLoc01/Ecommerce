import { PrismaService } from '@app/common/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { VoucherController } from './voucher.controller'
import { VoucherService } from './voucher.service'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [],
  controllers: [VoucherController],
  providers: [VoucherService, PrismaService, JwtService]
})
export class VoucherModule {}
