import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { updateStoreRoleId } from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentUserType } from 'common/types/current.type'
import { QueryAllUserProfileDTO } from '../dtos/all_user.dto'
import { UpdateUserProfileDTO } from '../dtos/update_user_profile.dto'
import { UserService } from './user.service'

@Controller('profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN, Role.STORE_OWNER)
  @Get('all-user')
  getAllUserProfile(@Query() query: QueryAllUserProfileDTO) {
    return this.userService.findAllUserProfile(query)
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard)
  @Get()
  profileDetail(@CurrentUser() user: CurrentUserType) {
    return this.userService.profileDetail(user)
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard)
  @Put()
  userUpdateProfile(@CurrentUser() user: CurrentUserType, @Body() body: UpdateUserProfileDTO) {
    return this.userService.userUpdateProfile(user, body)
  }

  @MessagePattern(updateStoreRoleId)
  updateStoreRoleId(@Payload() payload: { userId: string; storeRoleId: string }) {
    return this.userService.updateStoreRole(payload.userId, payload.storeRoleId)
  }
}
