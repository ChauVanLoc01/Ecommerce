import { Module } from '@nestjs/common'
import { ConfigModule, PrismaModule } from '@app/common'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { LocalUserStrategy } from './strategys/localUser.stategy'

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: 'Chauvanloc',
      signOptions: {
        expiresIn: 1000 * 60 * 60 * 8
      }
    })
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, LocalUserStrategy]
})
export class UserModule {}
