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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { StoreStrategy } from 'common/strategys/store.stategy'

@ApiTags('authentication')
@ApiBearerAuth()
@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200})
  @UseGuards(LocalUserGuard)
  @Post('user-login')
  userLogin(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userLogin(user, response)
  }

  @ApiResponse({ status: 201})
  @Post('user-register')
  userRegister(
    @Body() registerDTO: RegisterDTO,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.userRegister(registerDTO, response)
  }

  @UseGuards(StoreStrategy)
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

  @Get('otp/:email')
  sendOtp(@Param('email') email: string) {
    // return this.authService.sendOtp(email)
  }

  @Post('reset-password')
  resetPassword(@Body() body: SendOtpDTO) {
    return this.authService.resetPassword(body)
  }
}
