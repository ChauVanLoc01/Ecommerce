import { PrismaService } from '@app/common/prisma/prisma.service'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { v4 as uuidv4 } from 'uuid'
import { CreateDeliveryDTO } from '../dtos/create_delivery.dto'
import { UpdateDeliveryDTO } from '../dtos/update_delivery.dto'

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllDelivery(user: CurrentUserType): Promise<Return> {
    return {
      msg: 'Lấy danh sách vận chuyển thành công',
      result: await this.prisma.deliveryInformation.findMany({
        where: {
          userId: user.id
        }
      })
    }
  }

  async createDelivery(user: CurrentUserType, body: CreateDeliveryDTO): Promise<Return> {
    const { isPrimary, ...rest } = body

    if (isPrimary) {
      const hasPrimaryDelivery = await this.prisma.deliveryInformation.findFirst({
        where: {
          userId: user.id,
          isPrimary: 1
        }
      })

      if (hasPrimaryDelivery) {
        await this.prisma.deliveryInformation.update({
          where: {
            id: hasPrimaryDelivery.id
          },
          data: {
            isPrimary: 0
          }
        })
      }
    }

    const createdDelivery = await this.prisma.deliveryInformation.create({
      data: {
        ...rest,
        isPrimary: isPrimary ? 1 : 0,
        userId: user.id,
        id: uuidv4()
      }
    })

    return {
      msg: 'Tạo thông tin vận chuyển thành công',
      result: createdDelivery
    }
  }

  async updateDelivery(user: CurrentUserType, body: UpdateDeliveryDTO): Promise<Return> {
    const { id, ...rest } = body
    const deliveryExist = await this.prisma.deliveryInformation.findUnique({
      where: {
        id
      }
    })

    if (!deliveryExist) {
      throw new NotFoundException('Không tìm thấy thông tin vận chuyển')
    }

    return {
      msg: 'Cập nhật thông tin vận chuyển thành công',
      result: await this.prisma.deliveryInformation.update({
        where: {
          id
        },
        data: {
          ...rest,
          isPrimary: rest.isPrimary ? 1 : 0
        }
      })
    }
  }

  async deleteDelivery(user: CurrentUserType, id: string): Promise<Return> {
    const deliveryExist = await this.prisma.deliveryInformation.findUnique({
      where: {
        id,
        userId: user.id
      }
    })

    if (!deliveryExist) {
      throw new NotFoundException('Thông tin vận chuyển không tồn tại')
    }

    await this.prisma.deliveryInformation.delete({
      where: {
        id
      }
    })

    return {
      msg: 'Xóa thông tin vận chuyển thành công',
      result: undefined
    }
  }

  async checkDeliveryInformationId(user: CurrentUserType, deliveryInformationId: string) {
    return await this.prisma.deliveryInformation.findUnique({
      where: {
        id: deliveryInformationId,
        userId: user.id
      }
    })
  }
}