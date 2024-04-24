import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { StoreGuard } from 'common/guards/store.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { LocalUserGuard } from '../../../../common/guards/local.guard'
import { ChangePasswordDTO } from '../dtos/change_password.dto'
import { LoginDTO } from '../dtos/login.dto'
import { RegisterDTO } from '../dtos/register.dto'
import { ResetPasswordDTO } from '../dtos/reset_password.dto'
import { SendOtpDTO } from '../dtos/sendOTP.dto'
import { AuthService } from './auth.service'
import { ResetPasswordForEmployee } from '../dtos/reset_password_for_employee.dto'

@ApiTags('authentication')
@Controller('authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({ status: 200 })
  @Roles(Role.USER)
  @UseGuards(LocalUserGuard)
  @Post('user-login')
  userLogin(
    @CurrentUser() user: CurrentUserType,
    @Body() _: LoginDTO,
  ) {
    return this.authService.userLogin(user)
  }

  @ApiResponse({ status: 201 })
  @Post('user-register')
  userRegister(
    @Body() registerDTO: RegisterDTO,
  ) {
    return this.authService.userRegister(registerDTO)
  }

  @UseGuards(StoreGuard)
  @Post('store-login')
  storeLogin(
    @CurrentUser() user: CurrentStoreType,
    @Body() _: LoginDTO,
  ) {
    return this.authService.storeLogin(user)
  }

  @UseGuards(JwtGuard)
  @Roles(Role.STORE_OWNER)
  @Post('employee-register')
  employeeRegister(
    @CurrentUser() store: CurrentStoreType,
    @Body() body: RegisterDTO,
  ) {
    return this.authService.employeeRegister(store, body)
  }

  @UseGuards(JwtGuard)
  @Roles(Role.ADMIN, Role.STORE_OWNER)
  @Put('employee/reset-password')
  resetPasswordForEmployee(@CurrentUser() store: CurrentStoreType, @Body() body: ResetPasswordForEmployee) {
    return this.authService.resetPasswordForEmployee(store, body)
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
