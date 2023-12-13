import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { Module } from '@nestjs/common'
import { LocalUserStrategy } from '../../../../common/strategys/local.stategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { Queue } from 'common/constants/queue.constant'
import { StoreStrategy } from 'common/strategys/store.stategy'

@Module({
  imports: [
    BullModule.registerQueue({
      name: Queue.sendMail
    }),
    ConfigModule,
    PrismaModule,
    PassportModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalUserStrategy, StoreStrategy],
  exports: [AuthService]
})
export class AuthModule {}
