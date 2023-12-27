import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common'
import { UserManagementService } from './user_mana.service'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { ApiBearerAuth } from '@nestjs/swagger'
import { JwtGuard } from 'common/guards/jwt.guard'
import { Status } from 'common/enums/status.enum'

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Roles(Role.ADMIN)
@Controller()
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Put(':userId')
  toggleUser(@Param('userId') userId: string, @Body('status') status: number) {}
}
