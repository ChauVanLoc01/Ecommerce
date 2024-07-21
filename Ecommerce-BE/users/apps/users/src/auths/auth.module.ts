import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { BackgroundName } from 'common/constants/background-job.constant'
import { StoreStrategy } from 'common/strategys/store.stategy'
import { LocalUserStrategy } from '../../../../common/strategys/local.stategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

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
