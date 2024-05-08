import { Body, Controller, Get, Post, Put, Query, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType } from 'common/types/current.type'
import { UpdateEmployee } from '../dtos/update_employee.dto'
import { EmployeeService } from './employee.service'
import { UpdateUserProfileDTO } from '../dtos/update_user_profile.dto'
import { EmployeeQueryDTO } from '../dtos/employee_query.dto'

@Controller('employee')
@UseGuards(JwtGuard)
export class EmployeeController {
  constructor(private readonly empService: EmployeeService) {}

  @Roles(Role.STORE_OWNER, Role.ADMIN)
  @Get()
  getAllEmployee(@CurrentUser() store: CurrentStoreType, @Query() query: EmployeeQueryDTO) {
    return this.empService.getAll(store, query)
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard)
  @Put('employee-profile')
  userUpdateProfile(@CurrentUser() store: CurrentStoreType, @Body() body: UpdateUserProfileDTO) {
    return this.empService.employeeUpdateProfile(store, body)
  }

  @Roles(Role.ADMIN, Role.STORE_OWNER)
  @Put('update-status')
  updateStatus(@CurrentUser() store: CurrentStoreType, @Body() body: UpdateEmployee) {
    return this.empService.updateStatus(store, body)
  }
}
