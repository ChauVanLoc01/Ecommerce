import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserService } from './user.service'
import { User, Account, StoreRole } from '@prisma/client'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { UserRole } from 'common/enums/userRole.enum'
import { Status } from 'common/enums/status.enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService
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
}
