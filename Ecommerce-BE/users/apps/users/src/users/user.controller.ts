import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { CurrentUserType } from 'common/types/current.type'
import { UpdateUserProfileDTO } from '../dtos/update_user_profile.dto'
import { Roles } from 'common/decorators/roles.decorator'
import { QueryAllUserProfileDTO } from '../dtos/all_user.dto'
import { Role } from 'common/enums/role.enum'

@Controller('profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN, Role.STORE_OWNER)
  @Get('all-user')
  getAllUserProfile(@Query() query: QueryAllUserProfileDTO) {
    return this.userService.findAllUserProfile(query);
  }

  @Roles(Role.USER)
  @Get()
  profileDetail(@CurrentUser() user: CurrentUserType) {
    return this.userService.profileDetail(user)
  }

  @Roles(Role.ADMIN, Role.USER)
  @Put()
  updateProfile(
    @CurrentUser() user: CurrentUserType,
    @Body() body: UpdateUserProfileDTO
  ) {
    return this.userService.updateProfile(user, body)
  }
}
