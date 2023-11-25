import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'common/decorators/current-user.decorator'
import { CurrentUserType } from 'common/types/currentUser.type'
import { LoginDTO } from '../dtos/login.dto'
import { RegisterDTO } from '../dtos/register.dto'
import { AuthService } from './auth.service'
import { LocalUserGuard } from '../guards/local_user.guard'
import { Response } from 'express'

@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Phần này là dành cho User và cả Admin
  @UseGuards(LocalUserGuard)
  @Post('user/login')
  userLogin(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userLogin(user, response)
  }

  @Post('user/register')
  userRegister(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userRegister(registerDTO, response)
  }

  @UseGuards(LocalUserGuard)
  @Post('store/login')
  storeLogin(
    @CurrentUser() user: CurrentUserType,
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.storeLogin(user, response)
  }
}
