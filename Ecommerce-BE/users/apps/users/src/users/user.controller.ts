import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
    countEmployee,
    getInfoUserInRating,
    updateStoreRoleId
} from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { QueryAllUserProfileDTO } from '../dtos/all_user.dto'
import { UpdateUserProfileDTO } from '../dtos/update_user_profile.dto'
import { UserService } from './user.service'
import { UpdateStatusOfUserDTO } from '../dtos/update_status_of_user.dto'

@Controller('profile')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Roles(Role.ADMIN)
    @Get('all-user')
    getAllUserProfile(@Query() query: QueryAllUserProfileDTO) {
        return this.userService.findAllUserProfile(query)
    }

    @Roles(Role.USER)
    @UseGuards(JwtGuard)
    @Get('user-profile')
    profileDetail(@CurrentUser() user: CurrentUserType) {
        return this.userService.profileDetail(user)
    }

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
    @UseGuards(JwtGuard)
    @Get('store-profile')
    profileDetailStore(@CurrentUser() user: CurrentStoreType) {
        return this.userService.profileStoreDetail(user)
    }

    @Roles(Role.USER)
    @UseGuards(JwtGuard)
    @Put('user-profile')
    userUpdateProfile(@CurrentUser() user: CurrentUserType, @Body() body: UpdateUserProfileDTO) {
        return this.userService.userUpdateProfile(user, body)
    }

    @Roles(Role.STORE_OWNER, Role.EMPLOYEE)
    @UseGuards(JwtGuard)
    @Put('store-profile')
    userStoreUpdateProfile(
        @CurrentUser() user: CurrentStoreType,
        @Body() body: UpdateUserProfileDTO
    ) {
        return this.userService.userStoreUpdateProfile(user, body)
    }

    @MessagePattern(updateStoreRoleId)
    updateStoreRoleId(@Payload() payload: { userId: string; storeRoleId: string }) {
        return this.userService.updateStoreRole(payload.userId, payload.storeRoleId)
    }

    @Public()
    @MessagePattern(getInfoUserInRating)
    getInfoUserInRating(@Payload() payload: string[]) {
        return this.userService.getInfoUserInRating(payload)
    }

    @Roles(Role.ADMIN, Role.STORE_OWNER, Role.STORE_OWNER)
    @Get('/user-profile/:userId')
    getProfileUser(@Param('userId') userId: string) {
        return this.userService.getProfileUser(userId)
    }

    @Public()
    @MessagePattern(countEmployee)
    countEmployee(@Payload() storeId: string) {
        return this.userService.countEmployee(storeId)
    }

    @Roles(Role.ADMIN)
    @Put('admin/:storeId')
    updateStatusOfUser(@Param('storeId') storeId: string, @Body() body: UpdateStatusOfUserDTO) {
        return this.userService.updateStatusOfUser(storeId, body)
    }
}
