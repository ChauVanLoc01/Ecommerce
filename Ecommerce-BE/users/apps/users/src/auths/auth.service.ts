import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User, Account, StoreRole } from '@prisma/client'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { UserRole } from 'common/enums/userRole.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentUserType } from 'common/types/currentUser.type'
import { Return } from 'common/types/result.type'
import { RegisterDTO } from '../dtos/register.dto'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import * as uuidv4 from 'uuid'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
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

  async validateUser(username: string, password: string): Promise<User> {
    const accountExist = await this.verify(username, password)

    const userExist = await this.prisma.user.findUnique({
      where: {
        id: accountExist.userId
      }
    })

    if (userExist.status === Status.BLOCK) {
      throw new UnauthorizedException('Tài khoản đã bị khóa')
    }

    if (userExist.role === UserRole.EMPLOYEE) {
      throw new UnauthorizedException('Tài khoản không được phép mua hàng')
    }

    return userExist
  }

  async validateStore(username: string, password: string): Promise<StoreRole> {
    const accountExist = await this.verify(username, password)
    return await this.prisma.storeRole.findUnique({
      where: {
        id: accountExist.storeRoleId
      }
    })
  }

  createAccessToken(user_id: string, role: number): Promise<string> {
    return this.jwtService.signAsync({ user_id, role })
  }

  createRefreshToken(id: string, role: number): Promise<string> {
    return this.jwtService.signAsync(
      { id, role },
      {
        expiresIn: '8h',
        privateKey: 'chauvanloc'
      }
    )
  }

  async decodeAccessToken(data: string) {
    return this.jwtService.decode(data)
  }

  async decodeRefreshToken(data: string) {
    return this.jwtService.decode(data, {})
  }

  setToken(access_token: string, refresh_token: string, response: Response) {
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
  }

  async userLogin(user: CurrentUserType, response: Response): Promise<Return> {
    const [access_token, refresh_token] = await Promise.all([
      this.createAccessToken(user.id, user.role),
      this.createRefreshToken(user.id, user.role)
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
          password: await this.hashPassword(password),
          userId: userProfileId
        }
      }),
      this.createAccessToken(userProfileId, UserRole.USER),
      this.createRefreshToken(userProfileId, UserRole.USER)
    ])

    this.setToken(access_token, refresh_token, response)

    return {
      msg: 'Đăng kí tài khoản thành công',
      result: rest
    }
  }
}
