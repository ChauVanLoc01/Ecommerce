import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
    BadRequestException,
    HttpException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Prisma, Product } from '@prisma/client'
import { Cache } from 'cache-manager'
import {
    checkDeliveryInformationId,
    checkStoreExist,
    checkVoucherExistToCreateOrder,
    getAllProductWithProductOrder,
    updateQuantityProducts,
    updateQuantiyProductsWhenCancelOrder
} from 'common/constants/event.constant'
import { OrderStatus } from 'common/enums/orderStatus.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { addHours, subDays } from 'date-fns'
import { isUndefined, max, omitBy, sumBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { AnalyticsOrderDTO } from '../dtos/analytics_order.dto'
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
            const { orderParameters, deliveryInformationId, globalVoucherId } = body

            let productIds: {
                storeId: string
                note?: string
                productId: string
                quantity: number
            }[] = []

            let storeIdKeyByVoucher: {
                orderIds: string[]
                voucherIds: string[]
                mixedVoucher: {
                    orderId: string
                    voucherId: string
                }[]
            } = { orderIds: [], mixedVoucher: [], voucherIds: [] }
            const stores = orderParameters.map((parameter) => {
                let orderId = uuidv4()
                let arr = []
                let mixed = []

                if (globalVoucherId) {
                    arr.push(globalVoucherId)
                    mixed.push({
                        orderId,
                        voucherId: globalVoucherId
                    })
                }
                if (parameter.voucherId) {
                    arr.push(parameter.voucherId)
                    mixed.push({
                        orderId,
                        voucherId: parameter.voucherId
                    })
                }

                storeIdKeyByVoucher = {
                    orderIds: [...storeIdKeyByVoucher.orderIds, orderId],
                    voucherIds: [...storeIdKeyByVoucher.voucherIds, ...arr],
                    mixedVoucher: [...storeIdKeyByVoucher.mixedVoucher, ...mixed]
                }

                parameter.orders.forEach((e) => {
                    productIds.push({
                        productId: e.productId,
                        quantity: e.quantity,
                        storeId: parameter.storeId
                    })
                })

                return parameter.storeId
            })

            const [deliveryReturn, storeReturn, productReturn, ...result] = await Promise.all([
                firstValueFrom<MessageReturn>(
                    this.userClient.send(checkDeliveryInformationId, {
                        userId: id,
                        deliveryInformationId
                    })
                ),
                firstValueFrom(this.storeClient.send<MessageReturn>(checkStoreExist, stores)),
                firstValueFrom(
                    this.productClient.send<MessageReturn>(updateQuantityProducts, productIds)
                ),
                ...orderParameters.map((parameter, idx) =>
                    this.prisma.order.create({
                        data: {
                            id: storeIdKeyByVoucher.orderIds[idx],
                            deliveryInformationId,
                            total: parameter.total,
                            discount: parameter.discount,
                            pay: parameter.pay,
                            status: OrderStatus.WAITING_CONFIRM,
                            storeId: parameter.storeId,
                            note: parameter.note,
                            userId: id,
                            createdAt: new Date(),
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

            if (!deliveryReturn.action) {
                throw new NotFoundException(deliveryReturn.msg)
            }

            if (!storeReturn.action) {
                throw new BadRequestException(storeReturn.msg)
            }

            if (!productReturn.action) {
                throw new BadRequestException(productReturn.msg)
            }

            let tmp = []

            if (storeIdKeyByVoucher.voucherIds.length) {
                tmp.push(
                    storeIdKeyByVoucher.mixedVoucher.map((e) =>
                        this.prisma.orderVoucher.create({
                            data: {
                                id: uuidv4(),
                                orderId: e.orderId,
                                voucherId: e.voucherId,
                                createdAt: new Date()
                            }
                        })
                    )
                )
            }

            const [voucherReturn, ..._] = await Promise.all([
                firstValueFrom<MessageReturn>(
                    this.storeClient.send(
                        checkVoucherExistToCreateOrder,
                        storeIdKeyByVoucher.voucherIds
                    )
                ),
                storeIdKeyByVoucher.orderIds.map((orderId) =>
                    this.prisma.orderFlow.create({
                        data: {
                            id: uuidv4(),
                            status: OrderStatus.WAITING_CONFIRM,
                            createdBy: id,
                            orderId,
                            createdAt: new Date()
                        }
                    })
                ),
                ...tmp
            ])

            if (!voucherReturn.action) {
                throw new BadRequestException(voucherReturn.msg)
            }

            return {
                msg: 'Tạo đơn hàng thành công',
                result
            }
        } catch (err) {
            console.log('error', err, typeof err)
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException('Đã có lỗi trong quá trình tạo đơn hàng')
            }
            throw new HttpException(err.response.message, err.status)
        }
    }

    async updateOrder(
        user: CurrentUserType,
        orderId: string,
        body: UpdateOrderType
    ): Promise<Return> {
        try {
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

            if (status === OrderStatus.CANCEL) {
                const [result, orderProducts] = await Promise.all([
                    this.prisma.order.update({
                        where: {
                            id: orderId
                        },
                        data: {
                            status
                        }
                    }),
                    firstValueFrom(
                        this.productClient.send(updateQuantiyProductsWhenCancelOrder, orderId)
                    ),
                    this.prisma.orderFlow.create({
                        data: {
                            id: uuidv4(),
                            status,
                            createdAt: new Date(),
                            createdBy: user.id,
                            orderId
                        }
                    })
                ])

                if (typeof orderProducts === 'string') {
                    throw new Error('Rollback product thất bại')
                }

                return {
                    msg: 'Cập nhật đơn hàng thành công',
                    result
                }
            }

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
        } catch (err) {
            throw new InternalServerErrorException('Lỗi BE')
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

    // async checkVoucherExistInVoucher(voucherId: string) {
    //     const voucherExist = await this.prisma.order.findMany({
    //         where: {
    //             voucherId
    //         }
    //     })

    //     if (voucherExist.length > 0) {
    //         return 'Voucher đã được sử dụng'
    //     }

    //     return ['ok']
    // }

    async receiptAnalyticByDate(user: CurrentStoreType, body: AnalyticsOrderDTO): Promise<Return> {
        const { dates } = body
        const { storeId } = user

        const orders = await Promise.all(
            dates.map((day, idx) =>
                this.prisma.order.findMany({
                    where: {
                        storeId,
                        createdAt: {
                            gte: day,
                            lt: dates[idx + 1]
                        }
                    }
                })
            )
        )

        const receipts = orders.map((e) => sumBy(e, (o) => o.pay))

        return {
            msg: 'ok',
            result: {
                receipts: receipts.map((e, idx) => ({ date: dates[idx], total: e })),
                current: receipts[receipts.length - 1],
                percent: Math.floor((receipts[receipts.length - 1] * 100) / max(receipts))
            }
        }
    }

    async orderAnalyticByDate(user: CurrentStoreType, body: AnalyticsOrderDTO): Promise<Return> {
        const { dates } = body
        const { storeId } = user

        const orders = await Promise.all(
            dates.map((day, idx) =>
                this.prisma.order.count({
                    where: {
                        storeId,
                        createdAt: {
                            gte: day,
                            lt: dates[idx + 1]
                        }
                    }
                })
            )
        )

        return {
            msg: 'ok',
            result: {
                orders: orders.map((e, idx) => ({ date: dates[idx], order: e })),
                current: orders[orders.length - 1],
                percent: Math.floor((orders[orders.length - 1] * 100) / max(orders))
            }
        }
    }

    async test() {
        return this.productClient.send('test', ['ok'])
    }

    async orderWithoutRating(userId: string, orderIds: string[]) {
        return await this.prisma.order.findMany({
            where: {
                userId,
                id: {
                    notIn: orderIds.length ? orderIds : undefined
                },
                createdAt: {
                    gte: subDays(addHours(new Date(), 7), 5)
                },
                status: OrderStatus.SUCCESS
            }
        })
    }
}
