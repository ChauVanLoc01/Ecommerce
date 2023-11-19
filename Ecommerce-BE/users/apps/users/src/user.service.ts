import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { LoginDTO } from './dtos/login.dto'
import { PrismaService } from '@app/common/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import { RegisterDTO } from './dtos/register.dto'
import { AuthService } from './auth.service'
import { CurrentUserType } from 'common/types/currentUser.type'
import * as cookieParser from 'cookie-parser'
import { Response } from 'express'
import { Return } from 'common/types/result.type'
import * as uuid from 'uuid'
import { UserRole } from 'common/enums/userRole.enum'
import { Status } from 'common/enums/status.enum'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService
  ) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  async userLogin(user: CurrentUserType, response: Response): Promise<Return> {
    const [access_token, refresh_token] = await Promise.all([
      this.authService.createAccessToken(user.id, user.role),
      this.authService.createRefreshToken(user.id, user.role)
    ])

    response.cookie('Authorization', access_token)

    response.cookie('refresh_token', refresh_token)

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

  async userRegister(registerDto: RegisterDTO) {
    const { email, password, username } = registerDto

    const userExist = await this.prisma.account.findUnique({
      where: {
        username,
        User: {
          email
        }
      }
    })

    if (userExist) {
      throw new BadRequestException('Tài khoản đã tồn tại')
    }

    // const createdUser = await this.prisma.account.create({
    //   data: {
    //     username,
    //     password: await this.hashPassword(password),
    //     User: {
    //       create: {
    //         code: '1',
    //         email,
    //         id: uuid(),
    //         role: UserRole.USER,
    //         status: Status.ACCESS,
    //         Address: {
    //           create: {
    //             id: uuid(),
    //             detailt: 'aasf',

    //           }
    //         }
    //       }
    //     }
    //   }
    // })
  }
}
