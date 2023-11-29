import { Controller, Get } from '@nestjs/common'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { CurrentUserType } from 'common/types/currentUser.type'
import { EmployeeService } from './employee.service'

@Controller('user')
export class EmployeeController {
  constructor(private readonly empService: EmployeeService) {}

  @Get()
  profileDetail(@CurrentUser() user: CurrentUserType) {
    return this.empService.profileDetail(user.id)
  }
}
