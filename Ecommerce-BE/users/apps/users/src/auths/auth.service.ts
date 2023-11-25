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
import * as uuidv4 from 'uuid'
import { LoginDTO } from '../dtos/login.dto'

@Injectable()
export class AuthService {
  private readonly refresh_token_secret_key: string
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.refresh_token_secret_key = configService.get<string>(
      'app.refresh_token_secret_key'
    )
  }

  createAccessToken(data: CurrentUserType): Promise<string> {
    return this.jwtService.signAsync(data)
  }

  createRefreshToken(data: CurrentUserType): Promise<string> {
    return this.jwtService.signAsync(data, {
      expiresIn: this.configService.get<number>(
        'app.refresh_token_expire_time'
      ),
      secret: this.refresh_token_secret_key
    })
  }

  decodeAccessToken(data: string) {
    return this.jwtService.verifyAsync(data)
  }

  decodeRefreshToken(data: string) {
    return this.jwtService.verifyAsync(data, {
      secret: this.refresh_token_secret_key
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
    const accountExist = await this.verify(username, password)

    const userExist = await this.prisma.user.findUnique({
      where: {
        id: accountExist.userId
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
      storeRoleId: accountExist.storeRoleId
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

    const userProfileId = uuidv4()

    const [{ code, createdAt, status, ...rest }, _] = await Promise.all([
      this.prisma.user.create({
        data: {
          id: userProfileId,
          code: 1,
          email,
          role: Role.USER,
          status: Status.ACCESS
        }
      }),
      this.prisma.account.create({
        data: {
          username,
          password: await this.hashPassword(password),
          userId: userProfileId
        }
      })
    ])

    const [access_token, refresh_token] = await Promise.all([
      this.createAccessToken({
        id: rest.id,
        role: rest.role,
        storeRoleId: accountExist.storeRoleId
      }),
      this.createRefreshToken({
        id: rest.id,
        role: rest.role,
        storeRoleId: accountExist.storeRoleId
      })
    ])

    await this.setToken(access_token, refresh_token, response)

    return {
      msg: 'Đăng kí tài khoản thành công',
      result: {
        ...rest,
        storeRoleId: accountExist.storeRoleId
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
}
