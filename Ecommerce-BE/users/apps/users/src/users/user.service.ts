import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { RegisterDTO } from '../dtos/register.dto'
import { AuthService } from '../auths/auth.service'
import { CurrentUserType } from 'common/types/current.type'
import { Response } from 'express'
import { Return } from 'common/types/result.type'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { v4 as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'
import { UpdateUserProfileType } from '../dtos/update_user_profile.dto'
import { User } from '@prisma/client'
import { QueryAllUserProfileType } from '../dtos/all_user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async findAllUserProfile(query: QueryAllUserProfileType) {
    return await this.prisma.user.findMany({
      where: {

      }
    })
  }

  async profileDetail(user: CurrentUserType): Promise<User> {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id: user.id
      }
    })

    if (!userExist) throw new NotFoundException('Người dùng không tồn tại')

    return userExist
  }

  async updateProfile(
    user: CurrentUserType,
    body: UpdateUserProfileType
  ): Promise<User> {
    const { birthday, email, full_name, address, status } = body
    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        birthday,
        email,
        full_name,
        address,
        status
      }
    })
    return updatedUser
  }
}
