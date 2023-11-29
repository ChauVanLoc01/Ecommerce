import { Module } from '@nestjs/common'
import { EmployeeModule } from './employees/employee.module'
import { AuthModule } from './auths/auth.module'
import { UserModule } from './users/user.module'
import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6400
      }
    }),
    ConfigModule,
    PrismaModule,
    AuthModule,
    EmployeeModule,
    UserModule
  ]
})
export class UserMainModule {}
