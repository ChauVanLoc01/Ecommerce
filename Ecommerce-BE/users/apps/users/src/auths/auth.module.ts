import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { Module } from '@nestjs/common'
import { LocalUserStrategy } from '../../../../common/strategys/local.stategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { BackgroundName } from 'common/constants/background-job.constant'
import { StoreStrategy } from 'common/strategys/store.stategy'

@Module({
  imports: [
    BullModule.registerQueue({
      name: BackgroundName.mail
    }),
    ConfigModule,
    PrismaModule,
    PassportModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalUserStrategy, StoreStrategy, JwtService],
  exports: [AuthService]
})
export class AuthModule {}
