import { PrismaModule } from '@app/common'
import { Module } from '@nestjs/common'
import { DeliveryController } from './delivery.controller'
import { DeliveryService } from './delivery.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [DeliveryController],
  providers: [DeliveryService]
})
export class DeliveryModule {}
