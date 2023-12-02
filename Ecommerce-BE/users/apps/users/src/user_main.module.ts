/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common'
import { EmployeeModule } from './employees/employee.module'
import { AuthModule } from './auths/auth.module'
import { UserModule } from './users/user.module'
import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('bullqueue.host'),
          port: configService.get('bullqueue.port')
        }
      }),
      inject: [ConfigService]
    }),
    ConfigModule,
    PrismaModule,
    AuthModule,
    EmployeeModule,
    UserModule
  ]
})
export class UserMainModule {}
