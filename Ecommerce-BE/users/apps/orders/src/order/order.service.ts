import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateOrderType } from '../dtos/create_order.dto'

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(userId: string) {
    return await this.prisma.order.findMany({
      where: {
        userId,
        ProductOrder: {
          some: {
            Product: {
              name: {}
            }
          }
        }
      }
    })
  }

  async getOne(userId: string, orderId: string) {
    const orderExist = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        userId
      }
    })

    if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

    return orderExist
  }

  create(userId: string, body: CreateOrderType) {}

  update() {}
}
