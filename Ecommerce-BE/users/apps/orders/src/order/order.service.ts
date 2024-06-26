import { PrismaService } from '@app/common/prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientProxy } from '@nestjs/microservices'
import { Product } from '@prisma/client'
import { Cache } from 'cache-manager'
import {
    checkDeliveryInformationId,
    checkStoreExist,
    checkVoucherExistToCreateOrder,
    getAllProductWithProductOrder,
    processOrder,
    processStepOneToCreatOrder,
    statusOfOrder,
    updateQuantityProducts,
    updateQuantiyProductsWhenCancelOrder,
    updateVoucherWhenCancelOrder
} from 'common/constants/event.constant'
import { OrderShipping, OrderStatus } from 'common/enums/orderStatus.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { hash } from 'common/utils/helper'
import { add, addHours, sub, subDays } from 'date-fns'
import { isUndefined, max, omitBy, sumBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { AnalyticsOrderDTO } from '../dtos/analytics_order.dto'
import { CreateOrderType, OrdersParameter } from '../dtos/create_order.dto'
import {
    AcceptRequestOrderRefundDTO,
    CloseOrderRefundDTO,
    CreateOrderRefundDTO,
    ReOpenOrderRefundDTO,
    UpdateOrderRefundDTO
} from '../dtos/order_refund.dto'
import { QueryOrderType } from '../dtos/query-order.dto'
import { UpdateOrderType } from '../dtos/update_order.dto'

@Injectable()
export class OrderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
        @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
        @Inject('USER_SERVICE') private userClient: ClientProxy,
        @Inject('STORE_SERVICE') private storeClient: ClientProxy,
        @Inject('SOCKET_SERVICE') private socketClient: ClientProxy
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

        const {
            product_name,
            createdAt,
            total,
            start_date,
            end_date,
            limit,
            page,
            status,
            orderId
        } = query

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
                    status,
                    id: {
                        contains: orderId
                    }
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
            const step_one = await firstValueFrom<MessageReturn<string | null>>(
                this.orderClient.send(processStepOneToCreatOrder, body.orderParameters)
            )

            if (step_one.action) {
                this.orderClient.emit(processOrder, { user, body })
            }

            if (!step_one.action) {
                throw new BadRequestException(step_one.msg || 'Tạo đơn hàng không thành công')
            }

            return {
                msg: 'Đơn hàng đang được xử lý',
                result: null
            }
        } catch (err) {
            this.socketClient.emit(statusOfOrder, {
                id: body.actionId,
                msg: err?.message || 'Tạo đơn hàng không thành công',
                action: false,
                result: null
            })
            throw new BadRequestException(err?.message || 'Tạo đơn hàng không thành công')
        }
    }

    async stepOne(body: InstanceType<typeof OrdersParameter>[]) {
        try {
            const innerPromise = body.map(async ({ voucherId, orders }) => {
                if (voucherId) {
                    let hahsVoucher = hash('voucher', voucherId)
                    let quantityVoucherCache = await this.cacheManager.get<number>(hahsVoucher)
                    if (quantityVoucherCache == 0) {
                        return Promise.reject({
                            action: false,
                            msg: 'Voucher đã hết lượt sử dụng',
                            result: voucherId
                        })
                    }
                }
                orders.forEach(async ({ productId }) => {
                    let hashProductId = hash('product', productId)
                    let fromCache = await this.cacheManager.get<string>(hashProductId)
                    if (fromCache) {
                        let { quantity } = JSON.parse(fromCache) as { quantity: number }
                        if (quantity == 0) {
                            return Promise.reject({
                                action: false,
                                msg: 'Sản phẩm không đủ số lượng',
                                result: productId
                            })
                        }
                    }
                })

                return Promise.resolve({ action: true, msg: 'ok', result: null })
            })

            await Promise.all(innerPromise)

            return {
                msg: 'ok',
                action: true,
                result: null
            }
        } catch (err) {
            return {
                msg: err?.msg || 'Tạo đơn hàng không thành công',
                action: false,
                result: err?.result || null
            }
        }
    }

    async processOrder(user: CurrentUserType, body: CreateOrderType) {
        var emitStatusOfOrder = (msg: string, action = false, result?: string[]) => {
            this.socketClient.emit<
                string,
                { id: string; msg: string; action: boolean; result: string[] | null }
            >(statusOfOrder, {
                id: body.actionId,
                msg,
                action,
                result: result || null
            })
            return
        }
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
                voucherIds: string[][]
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
                    arr.push(['global', globalVoucherId])
                    mixed.push({
                        orderId,
                        voucherId: globalVoucherId
                    })
                }
                if (parameter.voucherId) {
                    arr.push([parameter.storeId, parameter.voucherId])
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

            const [deliveryReturn, storeReturn] = await Promise.all([
                firstValueFrom<MessageReturn>(
                    this.userClient.send(checkDeliveryInformationId, {
                        userId: id,
                        deliveryInformationId
                    })
                ),
                firstValueFrom(this.storeClient.send<MessageReturn>(checkStoreExist, stores))
            ])

            if (!deliveryReturn.action) {
                emitStatusOfOrder(deliveryReturn.msg)
            }

            if (!storeReturn.action) {
                emitStatusOfOrder(storeReturn.msg)
            }

            const productReturn = await firstValueFrom(
                this.productClient.send<MessageReturn>(updateQuantityProducts, productIds)
            )

            if (!productReturn.action) {
                emitStatusOfOrder(productReturn.msg)
            }

            await Promise.all(
                orderParameters.map((parameter, idx) =>
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
            )

            const voucherReturn = await firstValueFrom<MessageReturn>(
                this.storeClient.send(
                    checkVoucherExistToCreateOrder,
                    storeIdKeyByVoucher.voucherIds
                )
            )

            if (!voucherReturn.action) {
                emitStatusOfOrder(voucherReturn.msg)
            }

            let tmp = []

            if (storeIdKeyByVoucher.voucherIds.length) {
                tmp = [
                    ...storeIdKeyByVoucher.mixedVoucher.map((e) =>
                        this.prisma.orderVoucher.create({
                            data: {
                                id: uuidv4(),
                                orderId: e.orderId,
                                voucherId: e.voucherId,
                                createdAt: new Date()
                            }
                        })
                    )
                ]
            }

            await Promise.all([
                ...storeIdKeyByVoucher.orderIds.map((orderId) =>
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

            emitStatusOfOrder('Đặt hàng thành công', true, storeIdKeyByVoucher.orderIds)
        } catch (err) {
            emitStatusOfOrder('Lỗi Server')
        }
    }

    async cancelOrder(
        user: CurrentUserType,
        orderId: string,
        body: UpdateOrderType
    ): Promise<Return> {
        try {
            const { reason } = body
            const orderExist = await this.prisma.order.findUnique({
                where: {
                    id: orderId,
                    userId: user.id
                }
            })

            if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

            if (orderExist.status === OrderStatus.SUCCESS) {
                throw new BadRequestException('Không thể cập nhật đơn hàng đã thành công')
            }

            const [updatedProduct, updatedVoucher] = await Promise.all([
                firstValueFrom<MessageReturn>(
                    this.productClient.send(updateQuantiyProductsWhenCancelOrder, orderId)
                ),
                firstValueFrom<MessageReturn>(
                    this.storeClient.send(updateVoucherWhenCancelOrder, {
                        orderId,
                        storeId: orderExist.storeId
                    })
                )
            ])

            if (!updatedProduct.action) {
                throw new BadRequestException(updatedProduct.msg)
            }

            if (!updatedVoucher.action) {
                throw new BadRequestException(updatedVoucher.msg)
            }

            await Promise.all([
                this.prisma.order.update({
                    where: {
                        id: orderId
                    },
                    data: {
                        status: OrderStatus.CANCEL
                    }
                }),
                this.prisma.orderFlow.create({
                    data: {
                        id: uuidv4(),
                        status: OrderStatus.CANCEL,
                        createdAt: new Date(),
                        createdBy: user.id,
                        orderId,
                        note: reason
                    }
                })
            ])

            return {
                msg: 'Cập nhật đơn hàng thành công',
                result: undefined
            }
        } catch (err) {
            throw new HttpException(err?.msg || 'Lỗi server', err?.statusCode || 500)
        }
    }

    async requestRefund(
        user: CurrentUserType,
        orderId: string,
        body: CreateOrderRefundDTO
    ): Promise<Return> {
        try {
            const { id: userId } = user

            const { title, description, productOrders, materials } = body

            const orderExist = await this.prisma.order.findUnique({
                where: {
                    id: orderId,
                    status: {
                        equals: OrderStatus.SUCCESS
                    },
                    createdAt: {
                        gt: sub(new Date(), { days: 3 }).toUTCString()
                    }
                },
                select: {
                    id: true
                }
            })

            if (!orderExist) {
                throw new BadRequestException('Đơn hàng không đủ điều kiện để tạo hoàn hàng')
            }

            await this.prisma.$transaction(async (tx) => {
                return await Promise.all([
                    tx.orderRefund.create({
                        data: {
                            id: uuidv4(),
                            title,
                            description,
                            createdBy: userId,
                            orderId,
                            status: OrderStatus.REQUEST_REFUND,
                            RefundMaterial: {
                                createMany: {
                                    data: materials.map(({ type, url, description }) => ({
                                        id: uuidv4(),
                                        type,
                                        url,
                                        description
                                    }))
                                }
                            },
                            ProductOrderRefund: {
                                createMany: {
                                    data: productOrders.map(
                                        ({ productOrderId, quantity, description }) => ({
                                            id: uuidv4(),
                                            productOrderId,
                                            quantity,
                                            description
                                        })
                                    )
                                }
                            }
                        }
                    }),
                    tx.orderFlow.create({
                        data: {
                            id: uuidv4(),
                            orderId,
                            status: OrderStatus.REQUEST_REFUND,
                            createdAt: new Date(),
                            createdBy: userId
                        }
                    }),
                    tx.order.update({
                        where: {
                            id: orderId
                        },
                        data: {
                            status: OrderStatus.REQUEST_REFUND,
                            numberOfRefund: {
                                decrement: 1
                            },
                            updatedAt: new Date()
                        }
                    })
                ])
            })

            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            throw new HttpException(
                (err?.message as string).length > 100 ? 'Tạo đơn hoàn hàng thất bại' : err.message,
                err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateRequestRefund(orderRefundId: string, body: UpdateOrderRefundDTO): Promise<Return> {
        try {
            const { description, materials, productOrders, title } = body

            const orderRefundExist = await this.prisma.orderRefund.findUnique({
                where: {
                    id: orderRefundId,
                    status: OrderStatus.REQUEST_REFUND
                },
                include: {
                    ProductOrderRefund: {
                        select: {
                            id: true
                        }
                    }
                }
            })

            if (orderRefundExist?.updatedAt) {
                throw new BadRequestException('Chỉ có thể cập nhật đơn hoàn hàng 1 lần duy nhất')
            }

            if (!orderRefundExist) {
                throw new BadRequestException('Đơn hoàn hàng không tồn tại')
            }

            await this.prisma.$transaction(async (tx) => {
                return await Promise.all([
                    tx.orderRefund.update({
                        where: {
                            id: orderRefundId
                        },
                        data: {
                            description,
                            title,
                            updatedAt: new Date(),
                            ProductOrderRefund: {
                                deleteMany: orderRefundExist.ProductOrderRefund.map(
                                    (productOrderRefundId) => productOrderRefundId
                                ),
                                createMany: {
                                    data: productOrders.map(
                                        ({ productOrderId, quantity, description }) => ({
                                            id: uuidv4(),
                                            productOrderId,
                                            quantity,
                                            description
                                        })
                                    )
                                }
                            },
                            RefundMaterial: {
                                deleteMany: {
                                    orderRefundId
                                },
                                createMany: {
                                    data: materials.map(({ type, url, description }) => ({
                                        id: uuidv4(),
                                        type,
                                        url,
                                        description
                                    }))
                                }
                            }
                        }
                    }),
                    tx.orderFlow.create({
                        data: {
                            id: uuidv4(),
                            status: OrderStatus.UPDATE_REFUND,
                            createdAt: new Date(),
                            createdBy: orderRefundExist.createdBy,
                            orderId: orderRefundExist.orderId
                        }
                    })
                ])
            })

            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            throw new HttpException(
                (err?.message as string).length > 100
                    ? 'Cập nhật đơn hoàn hàng thất bại'
                    : err?.message || 'Lỗi server',
                err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async acceptRequestRefund(
        store: CurrentStoreType,
        orderRefundId: string,
        body: AcceptRequestOrderRefundDTO
    ): Promise<Return> {
        try {
            const orderRefundExist = await this.prisma.orderRefund.findUnique({
                where: {
                    id: orderRefundId,
                    status: OrderStatus.REQUEST_REFUND
                }
            })

            if (!orderRefundExist) {
                throw new BadRequestException(
                    'Đơn hoàn hàng không tồn tại hoặc không đủ điều kiện để tạo hoàn hàng'
                )
            }

            let { address, name } = body

            await this.prisma.$transaction([
                this.prisma.orderRefund.update({
                    where: {
                        id: orderRefundId
                    },
                    data: {
                        status: OrderStatus.REFUND_SHIPPING,
                        updatedAt: new Date()
                    }
                }),
                this.prisma.order.update({
                    where: {
                        id: orderRefundExist.orderId
                    },
                    data: {
                        status: OrderStatus.REFUND_SHIPPING,
                        updatedAt: new Date()
                    }
                }),
                this.prisma.orderFlow.create({
                    data: {
                        id: uuidv4(),
                        status: OrderStatus.ACCEPT_REFUND,
                        createdAt: new Date(),
                        orderId: orderRefundExist.orderId,
                        createdBy: store.userId
                    }
                }),
                this.prisma.orderShipping.create({
                    data: {
                        id: uuidv4(),
                        name,
                        address,
                        type: OrderShipping.REFUND,
                        orderId: orderRefundExist.orderId,
                        createdBy: store.userId
                    }
                }),
                this.prisma.orderFlow.create({
                    data: {
                        id: uuidv4(),
                        status: OrderStatus.REFUND_SHIPPING,
                        createdAt: add(new Date(), { seconds: 10 }).toUTCString(),
                        orderId: orderRefundExist.orderId,
                        createdBy: orderRefundExist.createdBy
                    }
                })
            ])

            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            throw new HttpException(
                (err?.message as string).length > 100
                    ? 'Cập nhật đơn hoàn hàng không thành công'
                    : err?.message || 'Lỗi Server',
                err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async closeRequestRefund(orderRefundId: string, body: CloseOrderRefundDTO): Promise<Return> {
        try {
            const { note } = body
            const orderRefundExist = await this.prisma.orderRefund.findUnique({
                where: {
                    id: orderRefundId,
                    status: OrderStatus.REFUND_SHIPPING
                }
            })

            if (!orderRefundExist) {
                throw new BadRequestException('Đơn hoàn hàng không tồn tại hoặc đã đóng')
            }

            await this.prisma.$transaction([
                this.prisma.orderRefund.update({
                    where: {
                        id: orderRefundId
                    },
                    data: {
                        status: OrderStatus.FINISH,
                        updatedAt: new Date()
                    }
                }),
                this.prisma.order.update({
                    where: {
                        id: orderRefundExist.orderId
                    },
                    data: {
                        status: OrderStatus.FINISH,
                        updatedAt: new Date()
                    }
                }),
                this.prisma.orderFlow.create({
                    data: {
                        id: uuidv4(),
                        status: OrderStatus.CLOSE_REFUND,
                        createdAt: new Date(),
                        createdBy: orderRefundExist.createdBy,
                        note,
                        orderId: orderRefundExist.orderId
                    }
                }),
                this.prisma.orderFlow.create({
                    data: {
                        id: uuidv4(),
                        status: OrderStatus.FINISH,
                        createdAt: add(new Date(), { seconds: 10 }),
                        orderId: orderRefundExist.orderId,
                        createdBy: orderRefundExist.createdBy
                    }
                })
            ])

            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            throw new HttpException(
                (err?.message as string).length > 100
                    ? 'Cập nhật thông tin đơn hoàn hàng thất bại'
                    : err?.message || 'Lỗi server',
                err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async reopenOrderRefund(orderRefundId: string, body: ReOpenOrderRefundDTO): Promise<Return> {
        try {
            const orderRefundExist = await this.prisma.orderRefund.findUnique({
                where: {
                    id: orderRefundId,
                    status: OrderStatus.REFUND_SHIPPING
                },
                include: {
                    ProductOrderRefund: true,
                    Order: {
                        select: {
                            numberOfRefund: true
                        }
                    }
                }
            })

            if (!orderRefundExist) {
                throw new BadRequestException('Đơn hoàn hàng không tồn tại hoặc đã đóng')
            }

            if (
                !orderRefundExist.Order.numberOfRefund ||
                orderRefundExist.Order.numberOfRefund == 0
            ) {
                throw new BadRequestException('Hoàn hàng tối đa 3 lần')
            }

            let { description, materials, title } = body

            await this.prisma.$transaction([
                this.prisma.orderRefund.update({
                    where: {
                        id: orderRefundId
                    },
                    data: {
                        status: OrderStatus.RE_OPEN_REFUND
                    }
                }),
                this.prisma.order.update({
                    where: {
                        id: orderRefundExist.orderId
                    },
                    data: {
                        status: OrderStatus.REQUEST_REFUND,
                        numberOfRefund: {
                            decrement: 1
                        }
                    }
                }),
                this.prisma.orderRefund.create({
                    data: {
                        id: uuidv4(),
                        title,
                        description,
                        status: OrderStatus.REQUEST_REFUND,
                        orderId: orderRefundExist.orderId,
                        createdBy: orderRefundExist.createdBy,
                        ProductOrderRefund: {
                            createMany: {
                                data: orderRefundExist.ProductOrderRefund.map(
                                    ({ description, productOrderId, quantity }) => ({
                                        id: uuidv4(),
                                        productOrderId,
                                        quantity,
                                        description
                                    })
                                )
                            }
                        },
                        RefundMaterial: {
                            createMany: {
                                data: materials.map(({ type, url, description }) => ({
                                    id: uuidv4(),
                                    type,
                                    url,
                                    description
                                }))
                            }
                        }
                    }
                }),
                this.prisma.orderFlow.create({
                    data: {
                        id: uuidv4(),
                        status: OrderStatus.RE_OPEN_REFUND,
                        createdBy: orderRefundExist.createdBy,
                        orderId: orderRefundExist.orderId
                    }
                }),
                this.prisma.orderFlow.create({
                    data: {
                        id: uuidv4(),
                        status: OrderStatus.REQUEST_REFUND,
                        createdBy: orderRefundExist.createdBy,
                        orderId: orderRefundExist.orderId,
                        createdAt: add(new Date(), { seconds: 10 })
                    }
                })
            ])

            return {
                msg: 'ok',
                result: undefined
            }
        } catch (err) {
            throw new HttpException(
                (err?.message as string).length > 100
                    ? 'Cập nhật trạng thái đơn hoàn hàng không thành công'
                    : err?.message || 'Lỗi server',
                err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    // async updateStatusByStore(
    //     user: CurrentStoreType,
    //     orderId: string,
    //     body: UpdateStatusOrderDTO
    // ): Promise<Return> {
    //     try {
    //         const updatedOrder = await this.prisma.$transaction(async (tx) => {
    //             const [orderExist, updatedOrder] = await Promise.all([
    //                 tx.order.findUnique({
    //                     where: {
    //                         id: orderId
    //                     }
    //                 }),
    //                 tx.order.update({
    //                     where: {
    //                         id: orderId
    //                     },
    //                     data: {
    //                         status: body.status,
    //                         updatedAt: new Date().toISOString()
    //                     }
    //                 }),
    //                 tx.orderFlow.create({
    //                     data: {
    //                         id: uuidv4(),
    //                         status: body.status,
    //                         createdBy: user.userId,
    //                         note: body.note,
    //                         orderId,
    //                         createdAt: new Date().toISOString()
    //                     }
    //                 })
    //             ])

    //             if (!orderExist) {
    //                 throw new Error('Đơn hàng không tồn tại')
    //             }

    //             return updatedOrder
    //         })
    //         return {
    //             msg: 'ok',
    //             result: updatedOrder
    //         }
    //     } catch (err) {
    //         throw new BadRequestException(err.message)
    //     }
    // }

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

    async doneTask() {
        setTimeout(() => {
            this.socketClient.emit('done', 'ok')
            console.log('ok')
        }, 5000)
    }
}
