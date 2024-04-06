import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Prisma, Store } from '@prisma/client'
import { Cache } from 'cache-manager'
import {
  checkDeliveryInformationId,
  checkStoreExist,
  updateQuantityProducts
} from 'common/constants/event.constant'
import { OrderStatus } from 'common/enums/orderStatus.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateOrderType } from '../dtos/create_order.dto'
import { QueryOrderType } from '../dtos/query-order.dto'
import { UpdateOrderType } from '../dtos/update_order.dto'

@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('STORE_SERVICE') private storeClient: ClientProxy
  ) {}

  async getAllOrderByUser(user: CurrentUserType, query: QueryOrderType): Promise<Return> {
    const { id } = user

    const { product_name, createdAt, total, start_date, end_date, limit, page } = query

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

  async getOrderDetailByUser(user: CurrentUserType, orderId: string): Promise<Return> {
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

  async getAllOrderByStore(user: CurrentStoreType, query: QueryOrderType): Promise<Return> {
    const { storeId } = user

    const { product_name, createdAt, total, start_date, end_date, limit, page } = query

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

  async getOrderDetailByStore(user: CurrentStoreType, orderId: string): Promise<Return> {
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

  async createOrder(user: CurrentUserType, body: CreateOrderType): Promise<Return> {
    try {
      const { id } = user
      const { orderParameters, deliveryInformationId, voucherId } = body

      const isDeliveryInformationExist = await firstValueFrom(
        this.userClient.send(checkDeliveryInformationId, {
          user,
          deliveryInformationId
        })
      )

      if (!isDeliveryInformationExist) {
        throw new NotFoundException('Không tồn tại thông tin vận chuyển')
      }

      const stores = orderParameters.map((parameter) => parameter.storeId)

      const isStoresExist = await firstValueFrom(
        this.storeClient.send<Store[], string[]>(checkStoreExist, stores)
      )

      const convertStoreExist = isStoresExist.filter((e) => e)

      if (stores.length !== convertStoreExist.length) {
        throw new BadRequestException('Lỗi cửa hàng không tồn tại')
      }

      const updatedProducts = await firstValueFrom(
        this.productClient.send(updateQuantityProducts, orderParameters)
      )

      if (typeof updatedProducts === 'string') {
        throw new BadRequestException(updatedProducts)
      }

      const result = await Promise.all(
        orderParameters.map((parameter) =>
          this.prisma.order.create({
            data: {
              id: uuidv4(),
              deliveryInformationId,
              total: parameter.orders.reduce((acu, order) => {
                if (order.price_before) {
                  return acu + order.price_before * order.quantity
                }
                return acu + order.price_after * order.quantity
              }, 0),
              discount: parameter.orders.reduce((acu, order) => {
                if (order.price_before) {
                  return acu + (order.price_before - order.price_after) * order.quantity
                }
                return acu
              }, 0),
              pay: parameter.orders.reduce(
                (acu, order) => acu + order.price_after * order.quantity,
                0
              ),
              status: OrderStatus.WAITING_CONFIRM,
              storeId: parameter.storeId,
              note: parameter.note,
              userId: id,
              voucherId,
              ProductOrder: {
                createMany: {
                  data: parameter.orders.map((order) => {
                    return {
                      id: uuidv4(),
                      productId: order.productId,
                      quantity: order.quantity,
                      priceBefore: order.price_before,
                      priceAfter: order.price_after
                    }
                  })
                }
              }
            }
          })
        )
      )
      return {
        msg: 'Tạo đơn hàng thành công',
        result
      }
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException('Đã có lỗi trong quá trình tạo đơn hàng')
      }
      throw new BadRequestException(err.message)
    }
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
          status
        }
      })
    }
  }

  async test() {
    return this.productClient.send('test', ['ok'])
  }
}
