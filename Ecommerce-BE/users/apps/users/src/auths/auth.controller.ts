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
import { CurrentUserType } from 'common/types/current.type'
import { LoginDTO } from '../dtos/login.dto'
import { RegisterDTO } from '../dtos/register.dto'
import { AuthService } from './auth.service'
import { LocalUserGuard } from '../../../../common/guards/local.guard'
import { Response } from 'express'
import { JwtGuard } from 'common/guards/jwt.guard'
import { ChangePasswordDTO } from '../dtos/change_password.dto'
import { SendOtpDTO } from '../dtos/sendOTP.dto'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { StoreStrategy } from 'common/strategys/store.stategy'
import { ResetPasswordDTO } from '../dtos/reset_password.dto'
import { StoreGuard } from 'common/guards/store.guard'

@ApiTags('authentication')
@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200 })
  @UseGuards(LocalUserGuard)
  @Post('user-login')
  userLogin(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userLogin(user, response)
  }

  @ApiResponse({ status: 201 })
  @Post('user-register')
  userRegister(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userRegister(registerDTO, response)
  }

  @UseGuards(StoreGuard)
  @Post('store-login')
  storeLogin(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.storeLogin(user, response)
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Put('change-password')
  changePassword(
    @CurrentUser() user: CurrentUserType,
    @Body() body: ChangePasswordDTO
  ) {
    return this.authService.changePassword(user, body)
  }

  @Get('otp')
  sendOtp(@Body() body: SendOtpDTO) {
    return this.authService.sendOtp(body)
  }

  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(body)
  }
}
