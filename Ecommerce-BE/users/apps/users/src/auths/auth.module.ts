import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { Module } from '@nestjs/common'
import { LocalUserStrategy } from '../../../../common/strategys/local.stategy'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, PrismaModule } from '@app/common'

@Module({
  imports: [ConfigModule, PrismaModule, PassportModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, LocalUserStrategy],
  exports: [AuthService]
})
export class AuthModule {}
