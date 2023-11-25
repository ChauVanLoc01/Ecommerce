import {
  Body,
  Controller,
  Post,
  Put,
  Res,
  UseGuards,
  Get,
  Param
} from '@nestjs/common'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { CurrentUserType } from 'common/types/currentUser.type'
import { LoginDTO } from '../dtos/login.dto'
import { RegisterDTO } from '../dtos/register.dto'
import { AuthService } from './auth.service'
import { LocalUserGuard } from '../../../../common/guards/local.guard'
import { Response } from 'express'
import { JwtGuard } from 'common/guards/jwt.guard'
import { ChangePasswordDTO } from '../dtos/change_password.dto'
import { SendOtpDTO } from '../dtos/sendOTP.dto'

@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Phần này là dành cho User và cả Admin
  @UseGuards(LocalUserGuard)
  @Post('user-login')
  userLogin(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userLogin(user, response)
  }

  @Post('user-register')
  userRegister(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userRegister(registerDTO, response)
  }

  @UseGuards(LocalUserGuard)
  @Post('store-login')
  storeLogin(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.storeLogin(user, response)
  }

  @UseGuards(JwtGuard)
  @Put('change-password')
  changePassword(
    @CurrentUser() user: CurrentUserType,
    @Body() body: ChangePasswordDTO
  ) {
    return this.authService.changePassword(user, body)
  }

  @Get('send-otp/:email')
  sendOTP(@Param('email') email: string) {
    return this.authService.sendOTP(email)
  }

  @Post('reset-password')
  resetPassword(@Body() body: SendOtpDTO) {
    return this.authService.resetPassword(body)
  }
}
