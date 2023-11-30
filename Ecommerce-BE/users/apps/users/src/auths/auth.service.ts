import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User, Account, StoreRole } from '@prisma/client'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentUserType } from 'common/types/currentUser.type'
import { Return } from 'common/types/result.type'
import { RegisterDTO } from '../dtos/register.dto'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'
import { ChangePasswordType } from '../dtos/change_password.dto'
import { SendOtpType } from '../dtos/sendOTP.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  createAccessToken(data: CurrentUserType): Promise<string> {
    return this.jwtService.signAsync(data, {
      secret: this.configService.get<string>('app.access_token_secret_key'),
      expiresIn: this.configService.get<number>('app.access_token_expire_time')
    })
  }

  createRefreshToken(data: CurrentUserType): Promise<string> {
    return this.jwtService.signAsync(data, {
      secret: this.configService.get<string>('app.refresh_token_secret_key'),
      expiresIn: this.configService.get<number>('app.refresh_token_expire_time')
    })
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  setToken(
    access_token: string,
    refresh_token: string,
    response: Response
  ): Promise<() => void> {
    return Promise.resolve(() => {
      response.cookie('Authentication', `Bearer ${access_token}`, {
        httpOnly: true,
        secure: true,
        maxAge: this.configService.get<number>('app.access_token_expire_time')
      })
      response.cookie('RefreshToken', `Bearer ${refresh_token}`, {
        httpOnly: true,
        secure: true,
        maxAge: this.configService.get<number>('app.refresh_token_expire_time')
      })
    })
  }

  async verify(username: string, password: string): Promise<Account> {
    const accountExist = await this.prisma.account.findUnique({
      where: {
        username
      }
    })

    if (!accountExist) {
      throw new UnauthorizedException('Tài khoản không tồn tại')
    }

    const isTruePassword = await this.comparePassword(
      password,
      accountExist.password
    )

    if (!isTruePassword) {
      throw new UnauthorizedException('Mật khẩu không đúng')
    }
    return accountExist
  }

  async validateUser(
    username: string,
    password: string
  ): Promise<User & { storeRoleId: string }> {
    const { userId, storeRoleId } = await this.verify(username, password)

    const userExist = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })

    if (userExist.status === Status.BLOCK) {
      throw new UnauthorizedException('Tài khoản đã bị khóa')
    }

    if (userExist.role === Role.EMPLOYEE) {
      throw new UnauthorizedException('Tài khoản không được phép mua hàng')
    }

    return {
      ...userExist,
      storeRoleId
    }
  }

  async validateStore(username: string, password: string): Promise<StoreRole> {
    const accountExist = await this.verify(username, password)
    return await this.prisma.storeRole.findUnique({
      where: {
        id: accountExist.storeRoleId
      }
    })
  }

  async userLogin(user: CurrentUserType, response: Response): Promise<Return> {
    const [access_token, refresh_token] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user)
    ])

    await this.setToken(access_token, refresh_token, response)

    const { code, createdAt, status, ...rest } =
      await this.prisma.user.findUnique({
        where: {
          id: user.id
        }
      })

    return {
      msg: 'Đăng nhập thành công',
      result: {
        ...rest,
        storeRoleId: user.storeRoleId
      }
    }
  }

  async userRegister(
    registerDto: RegisterDTO,
    response: Response
  ): Promise<Return> {
    const { email, password, username } = registerDto

    const accountExist = await this.prisma.account.findUnique({
      where: {
        username
      }
    })

    if (accountExist) {
      throw new BadRequestException('User name đã tồn tại')
    }

    const [{ code, createdAt, status, ...rest }, { storeRoleId }] =
      await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            id: uuidv4(),
            code: 1,
            email,
            role: Role.USER,
            status: Status.ACCESS
          }
        })

        const account = await tx.account.create({
          data: {
            username,
            password: await this.hashPassword(password),
            userId: user.id
          }
        })

        return [user, account]
      })

    const current_user = {
      id: rest.id,
      role: rest.role,
      storeRoleId
    } as CurrentUserType

    const [access_token, refresh_token] = await Promise.all([
      this.createAccessToken(current_user),
      this.createRefreshToken(current_user)
    ])

    await this.setToken(access_token, refresh_token, response)

    return {
      msg: 'Đăng kí tài khoản thành công',
      result: {
        ...rest,
        storeRoleId
      }
    }
  }

  async storeLogin(user: CurrentUserType, response: Response) {
    const [access_token, refresh_token] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user)
    ])

    await this.setToken(access_token, refresh_token, response)

    const [user_profile, store] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: user.id
        }
      }),
      this.prisma.storeRole.findUnique({
        where: {
          id: user.storeRoleId
        },
        include: {
          Store: true
        }
      })
    ])

    return {
      user: user_profile,
      store
    }
  }

  async changePassword(
    user: CurrentUserType,
    body: ChangePasswordType
  ): Promise<Return> {
    const { current_password, new_password } = body

    if (current_password === new_password) {
      throw new BadRequestException('Mật khẩu mới phải khác mật khẩu cũ')
    }

    const accountExist = await this.prisma.account.findFirst({
      where: {
        userId: user.id
      }
    })

    if (!accountExist) throw new BadRequestException('Tải khoản không tồn tại')

    const { password, ...rest } = await this.prisma.account.update({
      where: {
        username: accountExist.username
      },
      data: {
        password: await this.hashPassword(new_password),
        updatedAt: new Date()
      }
    })

    return {
      msg: 'Thay đổi mật khẩu thành công',
      result: rest
    }
  }

  async sendOTP(email: string) {}

  async resetPassword(body: SendOtpType) {}
}