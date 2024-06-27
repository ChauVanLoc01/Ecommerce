import { PrismaService } from '@app/common/prisma/prisma.service'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { VoucherController } from './voucher.controller'
import { VoucherService } from './voucher.service'

@Module({
    imports: [],
    controllers: [VoucherController],
    providers: [VoucherService, PrismaService, JwtService]
})
export class VoucherModule {}
