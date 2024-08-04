import { PrismaService } from '@app/common/prisma/prisma.service'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { BackgroundName } from 'common/constants/background-job.constant'
import { ProductSaleConsummer } from '../worker/product_sale.worker'
import { SaleController } from './sale.controller'
import { SaleService } from './sale.service'
import { ScheduleService } from './schedule.service'

@Module({
    imports: [
        BullModule.registerQueue({
            name: BackgroundName.product_sale
        })
    ],
    controllers: [SaleController],
    providers: [SaleService, ScheduleService, PrismaService, JwtService, ProductSaleConsummer]
})
export class SaleModule {}
