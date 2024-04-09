import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { QueryAllUserProfileType } from '../dtos/all_user.dto'
import { UpdateUserProfileType } from '../dtos/update_user_profile.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async findAllUserProfile(query: QueryAllUserProfileType) {
    return await this.prisma.user.findMany({
      where: {}
    })
  }

  async profileDetail(user: CurrentUserType): Promise<Return> {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id: user.id
      }
    })

    if (!userExist) throw new NotFoundException('Người dùng không tồn tại')

    return {
      msg: 'Lấy thông tin người thành công',
      result: userExist
    }
  }

  async userUpdateProfile(user: CurrentUserType, body: UpdateUserProfileType): Promise<Return> {
    const { birthday, email, full_name, address } = body

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        birthday,
        email,
        full_name,
        address
      }
    })

    return {
      msg: 'Cập nhật thành công',
      result: updatedUser
    }
  }

  async updateStoreRole(userId: string, storeRoleId: string) {
    try {
      const accountExist = await this.prisma.account.findFirst({
        where: {
          userId
        }
      })

      if (!accountExist) {
        throw new Error('Tài khoản không tồn tại')
      }

      return await this.prisma.account.update({
        where: {
          username: accountExist.username
        },
        data: {
          storeRoleId
        }
      })
    } catch (error) {
      return error.message
    }
  }
}
