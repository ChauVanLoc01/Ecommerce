import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { LoginDTO } from './dtos/login.dto'
import { LocalUserGuard } from './guards/localUser.guard'
import { RegisterDTO } from './dtos/register.dto'
import { AuthService } from './auth.service'
import { CurrentUser } from 'common/decorators/current-user.decorator'
import { CurrentUserType } from 'common/types/currentUser.type'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private authService: AuthService
  ) {}

  @UseGuards(LocalUserGuard)
  @Post('user-login')
  login(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.userService.userLogin(user, response)
  }

  @Post('user-register')
  register(@Body() registerDTO: RegisterDTO) {
    return this.userService.userRegister(registerDTO)
  }

  @Get()
  findOne() {
    return 'Hello'
  }
}