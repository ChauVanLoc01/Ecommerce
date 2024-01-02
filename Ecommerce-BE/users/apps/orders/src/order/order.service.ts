import { PrismaService } from '@app/common/prisma/prisma.service'
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { CreateOrderType } from '../dtos/create_order.dto'
import { Return } from 'common/types/result.type'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { UpdateOrderDTO, UpdateOrderType } from '../dtos/update_order.dto'
import { OrderStatus } from 'common/enums/orderStatus.enum'
import { QueryOrderType } from '../dtos/query-order.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async getAllOrderByUser(
    user: CurrentUserType,
    query: QueryOrderType
  ): Promise<Return> {
    const { id } = user

    const {
      product_name,
      createdAt,
      total,
      start_date,
      end_date,
      limit,
      page
    } = query

    const orders = await this.prisma.order.findMany({
      where: {
        userId: id,
        createdAt: {
          lte: end_date,
          gte: start_date
        },
        ProductOrder: {
          some: {
            Product: {
              name: product_name
            }
          }
        }
      },
      orderBy: {
        createdAt,
        total
      },
      take: limit | this.configService.get('app.limit_default'),
      skip: page && page > 1 ? (page - 1) * limit : 0,
      include: {
        ProductOrder: {
          include: {
            Product: true
          }
        }
      }
    })

    return {
      msg: 'Lấy dánh sách order thành công',
      result: orders
    }
  }

  async getOrderDetailByUser(
    user: CurrentUserType,
    orderId: string
  ): Promise<Return> {
    const orderExist = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        userId: user.id
      }
    })

    if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

    return {
      msg: 'Lấy thông tin đơn hàng thành công',
      result: orderExist
    }
  }

  // Dành cho store and admin

  async getAllOrderByStore(
    user: CurrentStoreType,
    query: QueryOrderType
  ): Promise<Return> {
    const { storeId } = user

    const {
      product_name,
      createdAt,
      total,
      start_date,
      end_date,
      limit,
      page
    } = query

    const orders = await this.prisma.order.findMany({
      where: {
        storeId,
        createdAt: {
          lte: end_date,
          gte: start_date
        },
        ProductOrder: {
          some: {
            Product: {
              name: {
                contains: product_name
              }
            }
          }
        }
      },
      orderBy: {
        createdAt,
        total
      },
      take: limit | this.configService.get('app.limit_default'),
      skip: page && page > 1 ? (page - 1) * limit : 0,
      include: {
        ProductOrder: {
          include: {
            Product: true
          }
        }
      }
    })

    return {
      msg: 'Lấy dánh sách order thành công',
      result: orders
    }
  }

  async getOrderDetailByStore(
    user: CurrentStoreType,
    orderId: string
  ): Promise<Return> {
    const orderExist = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        storeId: user.storeId
      }
    })

    if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

    return {
      msg: 'Lấy thông tin đơn hàng thành công',
      result: orderExist
    }
  }

  createOrder(user: CurrentUserType, body: CreateOrderType) {
    const { id } = user

    const { productIds, address, score, voucherId } = body
  }

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
