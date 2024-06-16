import { PrismaService } from '@app/common/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { SaleController } from './sale.controller'
import { SaleService } from './sale.service'
import { ScheduleService } from './schedule.service'

@Module({
  imports: [],
  controllers: [SaleController],
  providers: [SaleService, ScheduleService, PrismaService, JwtService]
})
export class SaleModule {}
