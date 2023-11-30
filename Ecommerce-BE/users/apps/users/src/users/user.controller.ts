import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { CurrentUserType } from 'common/types/currentUser.type'
import { UpdateUserProfileDTO } from '../dtos/update_user_profile.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  profileDetail(@CurrentUser() user: CurrentUserType) {
    return this.userService.profileDetail(user.id)
  }

  @Put('profile')
  updateProfile(
    @CurrentUser() user: CurrentUserType,
    @Body() body: UpdateUserProfileDTO
  ) {
    return this.userService.updateProfile(user.id, body)
  }
}
