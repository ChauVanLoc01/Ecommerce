import { PrismaService } from '@app/common/prisma/prisma.service'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { updateStoreRoleId } from 'common/constants/event.constant'
import { Role } from 'common/enums/role.enum'
import { Status } from 'common/enums/status.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateStoreDTO } from './dtos/create-store.dto'
import { UpdateStoreDTO } from './dtos/update-store.dto'

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('USER_SERVICE') private userClient: ClientProxy
  ) {}

  async registerStore(user: CurrentUserType, body: CreateStoreDTO): Promise<Return> {
    const { id } = user

    const { name, description, location, image } = body

    const accountExist = await this.prisma.account.findFirst({
      where: {
        userId: id
      }
    })

    if (accountExist.storeRoleId) {
      throw new BadRequestException('Tối đa 1 cửa hàng cho 1 tài khoản')
    }

    const [createdStore, createdStoreRole] = await this.prisma.$transaction(async (tx) => {
      const createdStore = await tx.store.create({
        data: {
          id: uuidv4(),
          image,
          name,
          location,
          status: Status.ACTIVE,
          createdBy: id,
          description
        }
      })
      const createdStoreRole = await tx.storeRole.create({
        data: {
          id: uuidv4(),
          role: Role.STORE_OWNER,
          status: Status.ACTIVE,
          createdBy: id,
          storeId: createdStore.id
        }
      })
      return [createdStore, createdStoreRole]
    })

    const resultUpdatedStoreRoleId = await firstValueFrom(
      this.userClient.send(updateStoreRoleId, { userId: id, storeRoleId: createdStoreRole.id })
    )

    if (typeof resultUpdatedStoreRoleId === 'string') {
      await Promise.all([
        this.prisma.store.delete({
          where: {
            id: createdStore.id
          }
        }),
        this.prisma.storeRole.delete({
          where: {
            id: createdStoreRole.id
          }
        })
      ])
      throw new InternalServerErrorException(resultUpdatedStoreRoleId)
    }

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

  async checkStoreExist(storesId: string[]) {
    return await Promise.all(
      storesId.map((storeId) =>
        this.prisma.store.findUnique({
          where: {
            id: storeId
          }
        })
      )
    )
  }
}
