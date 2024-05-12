import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Prisma, Product, Store } from '@prisma/client'
import { Cache } from 'cache-manager'
import {
  checkDeliveryInformationId,
  checkStoreExist,
  getAllProductWithProductOrder,
  updateQuantityProducts
} from 'common/constants/event.constant'
import { OrderStatus } from 'common/enums/orderStatus.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { Return } from 'common/types/result.type'
import { isUndefined, omitBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateOrderType } from '../dtos/create_order.dto'
import { QueryOrderType } from '../dtos/query-order.dto'
import { UpdateOrderType, UpdateStatusOrderDTO } from '../dtos/update_order.dto'

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

    const { product_name, createdAt, total, start_date, end_date, limit, page, status } = query

    const limitExist = limit | this.configService.get('app.limit_default')

    const [ordersAll, ordersQuery] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          userId: id,
          createdAt: {
            lte: end_date,
            gte: start_date
          },
          status
        }
      }),
      this.prisma.order.findMany({
        where: {
          userId: id,
          createdAt: {
            lte: end_date,
            gte: start_date
          },
          status
        },
        orderBy: {
          createdAt,
          total
        },
        take: limitExist,
        skip: page && page > 1 ? (page - 1) * limitExist : 0,
        include: {
          ProductOrder: true
        }
      })
    ])

    return {
      msg: 'Lấy dánh sách order thành công',
      result: {
        data: ordersQuery,
        query: omitBy(
          {
            ...query,
            page: page || 1,
            page_size: Math.ceil(ordersAll.length / limitExist)
          },
          isUndefined
        )
      }
    }
  }

  async getOrderDetailByUser(user: CurrentUserType, orderId: string): Promise<Return> {
    const orderExist = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        userId: user.id
      },
      include: {
        ProductOrder: true
      }
    })

    const productsInOrder: { [key: string]: Product } = await firstValueFrom(
      this.productClient.send(
        getAllProductWithProductOrder,
        orderExist.ProductOrder.map((productOder) => productOder.productId)
      )
    )

    if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

    const convertedProductOrder = await Promise.all(
      { ...orderExist }.ProductOrder.map((productOrder) => {
        return Promise.resolve({
          ...productOrder,
          name: productsInOrder[productOrder.productId].name,
          image: productsInOrder[productOrder.productId].image,
          category: productsInOrder[productOrder.productId].category,
          currentPriceAfter: productsInOrder[productOrder.productId].priceAfter
        })
      })
    )

    const delivery = await await firstValueFrom(
      this.userClient.send(checkDeliveryInformationId, {
        user,
        deliveryInformationId: orderExist.deliveryInformationId
      })
    )

    return {
      msg: 'Lấy thông tin đơn hàng thành công',
      result: {
        ...orderExist,
        ProductOrder: convertedProductOrder,
        delivery
      }
    }
  }

  // Dành cho store and admin

  async getAllOrderByStore(user: CurrentStoreType, query: QueryOrderType): Promise<Return> {
    const { storeId } = user

    const { product_name, createdAt, total, start_date, end_date, limit, page, status } = query

    const take = limit | this.configService.get('app.limit_default')

    const [length, orders] = await Promise.all([
      this.prisma.order.count({
        where: {
          storeId,
          createdAt: {
            lte: end_date,
            gte: start_date
          }
        }
      }),
      this.prisma.order.findMany({
        where: {
          storeId,
          createdAt: {
            lte: end_date,
            gte: start_date
          },
          status
        },
        orderBy: {
          createdAt,
          total
        },
        take,
        skip: page && page > 1 ? (page - 1) * take : 0
      })
    ])

    return {
      msg: 'Lấy dánh sách order thành công',
      result: {
        data: orders,
        query: omitBy(
          {
            ...query,
            page: page || 1,
            page_size: Math.ceil(length / take)
          },
          isUndefined
        )
      }
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

      const stores = orderParameters.map((parameter) => parameter.storeId)

      const [isDeliveryInformationExist, isStoresExist, updatedProducts, ...result] =
        await Promise.all([
          firstValueFrom(
            this.userClient.send(checkDeliveryInformationId, {
              user,
              deliveryInformationId
            })
          ),
          firstValueFrom(this.storeClient.send<Store[], string[]>(checkStoreExist, stores)),
          firstValueFrom(this.productClient.send(updateQuantityProducts, orderParameters)),
          ...orderParameters.map((parameter) =>
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
        ])

      if (!isDeliveryInformationExist) {
        throw new NotFoundException('Không tồn tại thông tin vận chuyển')
      }

      const convertStoreExist = isStoresExist.filter((e) => e)

      if (stores.length !== convertStoreExist.length) {
        throw new BadRequestException('Lỗi cửa hàng không tồn tại')
      }

      if (typeof updatedProducts === 'string') {
        throw new BadRequestException(updatedProducts)
      }

      await Promise.all(
        result.map((e) =>
          this.prisma.orderFlow.create({
            data: {
              id: uuidv4(),
              status: OrderStatus.WAITING_CONFIRM,
              createdBy: user.id,
              orderId: e.id,
              createdAt: new Date().toISOString()
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
      throw new BadRequestException('Không thể cập nhật đơn hàng đã hoàn tất')

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

  async updateStatusByStore(
    user: CurrentStoreType,
    orderId: string,
    body: UpdateStatusOrderDTO
  ): Promise<Return> {
    try {
      const updatedOrder = await this.prisma.$transaction(async (tx) => {
        const [orderExist, updatedOrder] = await Promise.all([
          tx.order.findUnique({
            where: {
              id: orderId
            }
          }),
          tx.order.update({
            where: {
              id: orderId
            },
            data: {
              status: body.status,
              updatedAt: new Date().toISOString()
            }
          }),
          tx.orderFlow.create({
            data: {
              id: uuidv4(),
              status: body.status,
              createdBy: user.userId,
              note: body.note,
              orderId,
              createdAt: new Date().toISOString()
            }
          })
        ])

        if (!orderExist) {
          throw new Error('Đơn hàng không tồn tại')
        }

        return updatedOrder
      })
      return {
        msg: 'ok',
        result: updatedOrder
      }
    } catch (err) {
      throw new BadRequestException(err.message)
    }
  }

  async getOrderStatusByStore(user: CurrentStoreType, orderId: string): Promise<Return> {
    try {
      return {
        msg: 'ok',
        result: await this.prisma.orderFlow.findMany({
          where: {
            orderId
          }
        })
      }
    } catch (err) {
      throw new BadRequestException('Đơn hàng không tồn tại')
    }
  }

  async analyticOrderStore(user: CurrentStoreType): Promise<Return> {
    const [all, success, waiting_confirm, shipping, cancel] = await Promise.all([
      this.prisma.order.count({
        where: {
          storeId: user.storeId
        }
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.SUCCESS,
          storeId: user.storeId
        }
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.WAITING_CONFIRM,
          storeId: user.storeId
        }
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.SHIPING,
          storeId: user.storeId
        }
      }),
      this.prisma.order.count({
        where: {
          status: OrderStatus.CANCEL,
          storeId: user.storeId
        }
      })
    ])
    return {
      msg: 'ok',
      result: {
        all,
        success,
        waiting_confirm,
        shipping,
        cancel
      }
    }
  }

  async test() {
    return this.productClient.send('test', ['ok'])
  }
}
