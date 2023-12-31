import { PrismaService } from '@app/common/prisma/prisma.service'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { v4 as uuidv4 } from 'uuid'
import { CreateStoreDTO } from './dtos/create-store.dto'
import { Return } from 'common/types/result.type'
import { UpdateStoreDTO } from './dtos/update-store.dto'
import { isUndefined, omitBy } from 'lodash'

@Injectable()
export class StoreService {
  constructor(private readonly prisma: PrismaService) {}

  async registerStore(
    user: CurrentUserType,
    body: CreateStoreDTO,
    file_name: string
  ): Promise<Return> {
    const { id } = user

    const { name, description, location } = body

    const accountExist = await this.prisma.account.findFirst({
      where: {
        userId: id
      }
    })

    if (accountExist.storeRoleId) {
      throw new BadRequestException('Mỗi người dùng có tối đa 1 cửa hàng')
    }

    const createdStore = await this.prisma.$transaction(async (tx) => {
      const createdStore = await tx.store.create({
        data: {
          id: uuidv4(),
          image: file_name,
          name,
          location,
          status: Status.ACCESS,
          createdBy: id,
          description
        }
      })

      const createdStoreRole = await tx.storeRole.create({
        data: {
          id: uuidv4(),
          role: Role.STORE_OWNER,
          status: Status.ACCESS,
          createdBy: id,
          storeId: createdStore.id
        }
      })

      await tx.account.update({
        where: {
          username: accountExist.username
        },
        data: {
          storeRoleId: createdStoreRole.id,
          updatedAt: new Date().toISOString(),
          updatedBy: id
        }
      })

      return createdStore
    })

    return {
      msg: 'Tạo cửa hàng thành công',
      result: createdStore
    }
  }

  async updateStore(
    user: CurrentStoreType,
    body: UpdateStoreDTO,
    file_name: string
  ): Promise<Return> {
    const { storeId } = user

    const { name, description, location } = body

    const updatedStore = await this.prisma.store.update({
      where: {
        id: storeId
      },
      data: {
        name,
        description,
        location,
        image: file_name
      }
    })

    return {
      msg: 'Cập nhật cửa hàng thành công',
      result: updatedStore
    }
  }
}
