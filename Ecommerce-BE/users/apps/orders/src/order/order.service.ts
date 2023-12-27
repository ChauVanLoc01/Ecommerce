import { PrismaService } from '@app/common/prisma/prisma.service'
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateOrderType } from '../dtos/create_order.dto'
import { Return } from 'common/types/result.type'
import { CurrentUserType } from 'common/types/current.type'
import { UpdateOrderDTO, UpdateOrderType } from '../dtos/update_order.dto'
import { OrderStatus } from 'common/enums/orderStatus.enum'

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

  async getProductDetail(orderId: string): Promise<Return> {
    const orderExist = await this.prisma.order.findUnique({
      where: {
        id: orderId
      }
    })

    if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

    return {
      msg: 'Lấy thông tin đơn hàng thành công',
      result: orderExist
    }
  }

  createOrder(userId: string, body: CreateOrderType) {}

  async updateOrder(
    user: CurrentUserType,
    orderId: string,
    body: UpdateOrderType
  ): Promise<Return> {
    const { address, status, transaction } = body

    const orderExist = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        userId: user.id
      }
    })

    if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

    if (orderExist.status === OrderStatus.SUCCESS)
      throw new BadRequestException('Không thể cập nhật đơn hàng thành công')

    return {
      msg: 'Cập nhật đơn hàng thành công',
      result: await this.prisma.order.update({
        where: {
          id: orderId
        },
        data: {
          status,
          address,
          transactionType: transaction
        }
      })
    }
  }
}
