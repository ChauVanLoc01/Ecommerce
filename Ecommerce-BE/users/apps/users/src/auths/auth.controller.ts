import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'common/decorators/current-user.decorator'
import { CurrentUserType } from 'common/types/currentUser.type'
import { LoginDTO } from '../dtos/login.dto'
import { RegisterDTO } from '../dtos/register.dto'
import { AuthService } from './auth.service'
import { LocalUserGuard } from '../guards/local_user.guard'
import { Response } from 'express'

@Controller('authen')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalUserGuard)
  @Post('user/login')
  login(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userLogin(user, response)
  }

  @Post('user/register')
  register(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userRegister(registerDTO, response)
  }
}
