import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { User, Account } from '@prisma/client'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { RegisterDTO } from '../dtos/register.dto'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { v4 as uuidv4 } from 'uuid'
import { ChangePasswordType } from '../dtos/change_password.dto'
import { SendOtpType } from '../dtos/sendOTP.dto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { QueueAction, QueueName } from 'common/constants/queue.constant'
import {
  EmailInfor,
  PasswordData,
  ResetPasswordType
} from '../workers/mail.worker'
import { ResetPasswordType as ResetPasswordDTOType } from '../dtos/reset_password.dto'
import { Cache } from 'cache-manager'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @InjectQueue(QueueName.mail) private sendMailQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  createAccessToken(data: CurrentUserType | CurrentStoreType): Promise<string> {
    return this.jwtService.signAsync(data, {
      secret: this.configService.get<string>('app.access_token_secret_key'),
      expiresIn: this.configService.get<number>('app.access_token_expire_time')
    })
  }

  createRefreshToken(
    data: CurrentUserType | CurrentStoreType
  ): Promise<string> {
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

  setToken(access_token: string, refresh_token: string, response: Response) {
    response.cookie('Authorization', `Bearer ${access_token}`, {
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

  async validateStore(
    username: string,
    password: string
  ): Promise<CurrentStoreType> {
    const accountExist = await this.verify(username, password)

    const { storeId, role } = await this.prisma.storeRole.findUnique({
      where: {
        id: accountExist.storeRoleId
      }
    })

    if (!storeId) {
      throw new UnauthorizedException('Tài khoản quản lý không tồn tại')
    }

    const [{ id: userId }, store] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: accountExist.userId
        }
      }),
      this.prisma.store.findUnique({
        where: {
          id: storeId
        }
      })
    ])

    if (!store) {
      throw new UnauthorizedException('Cửa hàng không tồn tại')
    }

    return {
      role,
      storeId,
      userId
    }
  }

  async userLogin(user: CurrentUserType, response: Response): Promise<Return> {
    const [access_token, refresh_token] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user)
    ])

    this.setToken(access_token, refresh_token, response)

    const { createdAt, status, ...rest } = await this.prisma.user.findUnique({
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
    const { email, password, username, full_name, address } = registerDto

    const accountExist = await this.prisma.account.findUnique({
      where: {
        username
      }
    })

    if (accountExist) {
      throw new BadRequestException('User name đã tồn tại')
    }

    const [{ createdAt, status, ...rest }, { storeRoleId }] =
      await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            id: uuidv4(),
            email,
            role: Role.USER,
            status: Status.ACCESS,
            full_name,
            address
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

    this.sendMailQueue.add(
      QueueAction.register,
      {
        to: email,
        subject: 'Chúc mừng bạn đã đăng kí tài khoản thành công',
        html: `<p>Xin chào người dùng ${full_name}. Chúc bạn có trải nghiệm mua sắm thật tuyệt vời</p>`
      } as EmailInfor,
      {
        removeOnComplete: true
      }
    )

    return {
      msg: 'Đăng kí tài khoản thành công',
      result: {
        ...rest,
        storeRoleId
      }
    }
  }

  async storeLogin(
    user: CurrentStoreType,
    response: Response
  ): Promise<Return> {
    const [access_token, refresh_token] = await Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user)
    ])

    this.setToken(access_token, refresh_token, response)

    const [user_profile, store] = await Promise.all([
      this.prisma.user.findUnique({
        where: {
          id: user.userId
        }
      }),
      this.prisma.store.findUnique({
        where: {
          id: user.storeId
        }
      })
    ])

    return {
      msg: 'Đăng nhập cửa hàng thành công',
      result: {
        user: user_profile,
        store
      }
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

    if (
      !(await this.comparePassword(current_password, accountExist.password))
    ) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng')
    }

    const { password, ...rest } = await this.prisma.account.update({
      where: {
        username: accountExist.username
      },
      data: {
        password: await this.hashPassword(new_password),
        updatedAt: new Date(),
        updatedBy: user.id
      }
    })

    return {
      msg: 'Thay đổi mật khẩu thành công',
      result: rest
    }
  }

  async sendOtp({ email, new_password }: SendOtpType): Promise<Return> {
    const userExist = await this.prisma.user.findFirst({
      where: {
        email
      },
      include: {
        Account_Account_userIdToUser: true
      }
    })

    if (!userExist) {
      throw new UnauthorizedException('Người dùng không tồn tại')
    }

    const code = Math.floor(100000 + Math.random() * 900000)

    const email_infor: EmailInfor = {
      html: `<div>Mã xác nhận làm mới mật khẩu của bạn là: <p style="color: red">${code}</p>. Vui lòng không cung cấp mã xác nhận cho bất kỳ ai.</div>`,
      subject: 'Thay đổi mật khẩu khẩn cấp',
      to: email
    }

    this.sendMailQueue.add(QueueAction.forgetPassword, {
      code,
      username: userExist.Account_Account_userIdToUser[0].username,
      new_password,
      email_infor
    } as ResetPasswordType)

    return {
      msg: 'Vui lòng kiểm tra email để nhận mã xác nhận',
      result: undefined
    }
  }

  async resetPassword({ code }: ResetPasswordDTOType): Promise<Return> {
    const { username, new_password }: PasswordData =
      await this.cacheManager.get(`${code}_RESET_PASSWORD`)

    if (!code) {
      throw new BadRequestException('Mã xác nhận không đúng hoặc đã hết hạn')
    }

    const { password, ...rest } = await this.prisma.account.update({
      where: {
        username
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
}
