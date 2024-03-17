import { Module } from '@nestjs/common'
import { EmployeeModule } from './employees/employee.module'
import { AuthModule } from './auths/auth.module'
import { UserModule } from './users/user.module'
import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'
import { MailerModule } from '@nestjs-modules/mailer'
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store'
import { JwtGuard } from 'common/guards/jwt.guard'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>('bullqueue.host'),
        port: configService.get<number>('bullqueue.port')
      })
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: configService.get<string>('bullqueue.mail_transport'),
        defaults: {
          from: configService.get<string>('bullqueue.my_mail')
        }
      })
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('bullqueue.host'),
          port: configService.get('bullqueue.port')
        }
      })
    }),
    ConfigModule,
    PrismaModule,
    AuthModule,
    EmployeeModule,
    UserModule
  ],
  providers: [JwtService]
})
export class UserMainModule {}
