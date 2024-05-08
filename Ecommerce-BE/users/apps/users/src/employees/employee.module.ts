import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '../auths/auth.module'
import { EmployeeController } from './employee.controller'
import { EmployeeService } from './employee.service'

@Module({
  imports: [JwtModule, AuthModule],
  controllers: [EmployeeController],
  providers: [EmployeeService]
})
export class EmployeeModule {}
