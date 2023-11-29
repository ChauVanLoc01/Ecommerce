/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common'
import { EmployeeModule } from './employees/employee.module'
import { AuthModule } from './auths/auth.module'
import { UserModule } from './users/user.module'
import { ConfigModule } from '@app/common'

@Module({
  imports: [ConfigModule, AuthModule, EmployeeModule, UserModule]
})
export class UserMainModule {}
