import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserService } from './user.service'
import { User, Account, StoreRole } from '@prisma/client'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { UserRole } from 'common/enums/userRole.enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async verify(username: string, password: string): Promise<Account> {
    const accountExist = await this.prisma.account.findUnique({
      where: {
        username
      }
    })
    if (!accountExist) {
      throw new UnauthorizedException('User name không tồn tại')
    }
    const hashPassword = this.jwtService.decode(password)
    if (accountExist.password !== hashPassword) {
      throw new UnauthorizedException('Password không đúng')
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

    if (userExist.status === UserRole.BLOCK) {
      throw new UnauthorizedException('Tài khoản đã bị khóa')
    }

    if (userExist.status === UserRole.EMPLOYEE) {
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

  async decode(type: 'access_token' | 'refresh_token', data: string) {
    if (type === 'access_token') {
      return this.jwtService.decode(data)
    }
    return this.jwtService.decode(data, {})
  }
}
