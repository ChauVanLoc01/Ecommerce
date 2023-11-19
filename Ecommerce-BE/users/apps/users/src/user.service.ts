import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { RegisterDTO } from './dtos/register.dto'
import { AuthService } from './auth.service'
import { CurrentUserType } from 'common/types/currentUser.type'
import { Response } from 'express'
import { Return } from 'common/types/result.type'
import { UserRole } from 'common/enums/userRole.enum'
import { Status } from 'common/enums/status.enum'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  setToken(access_token: string, refresh_token: string, response: Response) {
    response.cookie('Authorization', 'Bearer ' + access_token)
    response.cookie('refresh_token', 'Bearer ' + refresh_token)
  }

  async userLogin(user: CurrentUserType, response: Response): Promise<Return> {
    const [access_token, refresh_token] = await Promise.all([
      this.authService.createAccessToken(user.id, user.role),
      this.authService.createRefreshToken(user.id, user.role)
    ])

    this.setToken(access_token, refresh_token, response)

    const { code, createdAt, role, status, id, ...rest } =
      await this.prisma.user.findUnique({
        where: {
          id: user.id
        }
      })

    return {
      msg: 'Đăng nhập thành công',
      result: rest
    }
  }

  async userRegister(
    registerDto: RegisterDTO,
    response: Response
  ): Promise<Return> {
    const { email, password, username } = registerDto

    const userExist = await this.prisma.account.findUnique({
      where: {
        username
      }
    })

    if (userExist) {
      throw new BadRequestException('Tài khoản đã tồn tại')
    }

    const userProfileId = uuidv4()

    const [
      { code, createdAt, role, status, id, ...rest },
      _,
      access_token,
      refresh_token
    ] = await Promise.all([
      this.prisma.user.create({
        data: {
          id: userProfileId,
          code: 1,
          email,
          role: UserRole.USER,
          status: Status.ACCESS
        }
      }),
      this.prisma.account.create({
        data: {
          username,
          password: await this.authService.hashPassword(password),
          userId: userProfileId
        }
      }),
      this.authService.createAccessToken(userProfileId, UserRole.USER),
      this.authService.createRefreshToken(userProfileId, UserRole.USER)
    ])

    this.setToken(access_token, refresh_token, response)

    return {
      msg: 'Đăng kí tài khoản thành công',
      result: rest
    }
  }
}
