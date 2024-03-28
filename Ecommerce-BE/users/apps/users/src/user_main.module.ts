import { ConfigModule, PrismaModule } from '@app/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { BullModule } from '@nestjs/bull'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import * as redisStore from 'cache-manager-redis-store'
import { AuthModule } from './auths/auth.module'
import { EmployeeModule } from './employees/employee.module'
import { UserModule } from './users/user.module'
import { DeliveryModule } from './delivery/delivery.module'

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
    DeliveryModule,
    EmployeeModule,
    UserModule,
    JwtModule
  ],
  providers: []
})
export class UserMainModule {}
