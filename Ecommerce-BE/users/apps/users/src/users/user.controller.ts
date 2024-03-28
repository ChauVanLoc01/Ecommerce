import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { CurrentUserType } from 'common/types/current.type'
import { UpdateUserProfileDTO } from '../dtos/update_user_profile.dto'
import { Roles } from 'common/decorators/roles.decorator'
import { QueryAllUserProfileDTO } from '../dtos/all_user.dto'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { checkDeliveryInformationId } from 'common/constants/event.constant'

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
}
