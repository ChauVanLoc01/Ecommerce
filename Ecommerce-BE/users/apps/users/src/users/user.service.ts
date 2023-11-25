import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { RegisterDTO } from '../dtos/register.dto'
import { AuthService } from '../auths/auth.service'
import { CurrentUserType } from 'common/types/currentUser.type'
import { Response } from 'express'
import { Return } from 'common/types/result.type'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { v4 as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async userProfileDetail(id: string) {
    const userExist = await this.prisma.user.findUnique({
      where: {
        id
      },
      include: {
        Rank: true
      }
    })

    if (!userExist) throw new NotFoundException('Người dùng không tồn tại')

    return userExist
  }

  async useProfileList() {}
}
