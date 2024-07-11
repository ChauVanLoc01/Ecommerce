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
import { CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { Prisma, PrismaClient, Product } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { Cache } from 'cache-manager'
import {
    getAllProductWithProductOrder,
    processStepOneToCreatOrder,
    processStepTwoToCreateOrder,
    rollbackUpdateQuantiyProductsWhenCancelOrder,
    rollbackUpdateVoucherWhenCancelOrder,
    statusOfOrder,
    updateQuantityProducts,
    updateQuantiyProductsWhenCancelOrder,
    updateVoucherWhenCancelOrder
} from 'common/constants/event.constant'
import { NormalStatus, OrderFlowEnum, RefundStatus } from 'common/enums/orderStatus.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { OrderPayload } from 'common/types/order_payload.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { hash } from 'common/utils/helper'
import { CronJob } from 'cron'
import { add, addHours, compareDesc, isPast, sub, subDays } from 'date-fns'
import { Dictionary, isUndefined, max, omitBy, sumBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateOrderDTO } from '../../../../common/dtos/create_order.dto'
import { AnalyticsOrderDTO } from '../dtos/analytics_order.dto'
import {
    CreateOrderRefundDTO,
    ReOpenOrderRefundDTO,
    UpdateOrderRefundDTO,
    UpdateStatusOrderFlow
} from '../dtos/order_refund.dto'
import { QueryOrderType } from '../dtos/query-order.dto'

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
        @Inject('SOCKET_SERVICE') private socketClient: ClientProxy,
        private schedulerRegistry: SchedulerRegistry
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
        try {
            const orderExist = await this.prisma.order.findUnique({
                where: {
                    id: orderId,
                    userId: user.id
                },
                include: {
                    ProductOrder: true,
                    OrderShipping: true,
                    OrderVoucher: true,
                    OrderFlow: true,
                    OrderRefund: {
                        include: {
                            RefundMaterial: true,
                            ProductOrderRefund: true
                        }
                    }
                }
            })

            const productsInOrder = await firstValueFrom<MessageReturn<Dictionary<Product>>>(
                this.productClient.send(
                    getAllProductWithProductOrder,
                    orderExist.ProductOrder.map((productOder) => productOder.productId)
                )
            )

            if (!productsInOrder.action) {
                throw new BadRequestException(productsInOrder.msg)
            }

            const convertedProductOrder = await Promise.all(
                orderExist.ProductOrder.map((productOrder) => {
                    return {
                        ...productOrder,
                        name: productsInOrder.result[productOrder.productId].name,
                        image: productsInOrder.result[productOrder.productId].image,
                        category: productsInOrder.result[productOrder.productId].category,
                        currentPriceAfter: productsInOrder.result[productOrder.productId].priceAfter
                    }
                })
            )

            return {
                msg: 'Lấy thông tin đơn hàng thành công',
                result: {
                    ...orderExist,
                    ProductOrder: convertedProductOrder
                }
            }
        } catch (err) {
            throw new HttpException(
                (err?.message as string).length > 100 ? 'Lỗi server' : err.message,
                err?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
            )
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
            },
            include: {
                OrderRefund: true,
                OrderShipping: true,
                OrderVoucher: true,
                OrderFlow: true,
                ProductOrder: true
            }
        })

        if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

        return {
            msg: 'Lấy thông tin đơn hàng thành công',
            result: orderExist
        }
    }

    updateStatusOfOrderToClient(id: string, msg: string, action: boolean, result: string[] | null) {
        this.socketClient.emit(statusOfOrder, { id, msg, action, result })
    }

    async createOrder(user: CurrentUserType, body: CreateOrderDTO): Promise<Return> {
        this.orderClient.emit(processStepOneToCreatOrder, { user, body })
        return {
            msg: 'Đơn hàng đang được xử lý',
            result: null
        }
    }

    async checkCache(user: CurrentUserType, body: CreateOrderDTO) {
        let { orders } = body

        Promise.all(
            orders.map(async ({ voucherId, productOrders }) => {
                try {
                    if (voucherId) {
                        let hahsVoucher = hash('voucher', voucherId)
                        let quantityVoucherCache = await this.cacheManager.get<number>(hahsVoucher)
                        if (quantityVoucherCache == 0) {
                            return Promise.reject('Voucher đã hết lượt sử dụng')
                        }
                    }
                    productOrders.forEach(async ({ productId }) => {
                        let hashProductId = hash('product', productId)
                        let fromCache = await this.cacheManager.get<string>(hashProductId)
                        if (fromCache) {
                            let { quantity } = JSON.parse(fromCache) as { quantity: number }
                            if (quantity == 0) {
                                throw new Error('Sản phẩm không đủ số lượng')
                            }
                        }
                        return { msg: 'ok', result: null }
                    })
                } catch (err) {
                    return Promise.reject({ msg: err.message, action: false, result: null })
                }

                return { msg: 'ok' }
            })
        )
            .then((_) => {
                this.orderClient.emit(processStepTwoToCreateOrder, { user, body })
            })
            .catch((err) => {
                console.log('error at order', err)
                this.updateStatusOfOrderToClient(
                    body.actionId,
                    err?.msg || 'Tạo đơn hàng không thành công',
                    false,
                    err?.result || null
                )
            })
    }

    async processOrder(user: CurrentUserType, body: CreateOrderDTO) {
        const { id } = user
        const { orders, globalVoucherId, delivery_info } = body
        this.prisma
            .$transaction(
                orders.map((order) =>
                    this.prisma.order.create({
                        data: {
                            id: uuidv4(),
                            total: order.total,
                            discount: order.discount,
                            pay: order.pay,
                            status: OrderFlowEnum.WAITING_CONFIRM,
                            storeId: order.storeId,
                            note: order.note,
                            userId: id,
                            createdAt: new Date(),
                            ProductOrder: {
                                createMany: {
                                    data: order.productOrders.map(
                                        ({ productId, quantity, priceAfter, priceBefore }) => {
                                            return {
                                                id: uuidv4(),
                                                productId,
                                                quantity,
                                                priceBefore,
                                                priceAfter
                                            }
                                        }
                                    )
                                }
                            },
                            OrderShipping: {
                                create: {
                                    id: uuidv4(),
                                    address: delivery_info.address,
                                    name: delivery_info.name,
                                    type: OrderFlowEnum.WAITING_CONFIRM,
                                    createdBy: id
                                }
                            },
                            OrderFlow: {
                                create: {
                                    id: uuidv4(),
                                    status: OrderFlowEnum.WAITING_CONFIRM,
                                    createdBy: id,
                                    createdAt: new Date()
                                }
                            },
                            OrderVoucher: [order.voucherId, globalVoucherId].filter(Boolean).length
                                ? {
                                      createMany: {
                                          data: [order.voucherId, globalVoucherId]
                                              .filter(Boolean)
                                              .map((voucherId) => ({
                                                  id: uuidv4(),
                                                  voucherId,
                                                  createdAt: new Date()
                                              }))
                                      }
                                  }
                                : undefined
                        },
                        include: {
                            OrderShipping: {
                                select: {
                                    id: true
                                }
                            },
                            OrderFlow: {
                                select: {
                                    id: true
                                }
                            },
                            OrderVoucher: {
                                select: {
                                    id: true
                                }
                            },
                            ProductOrder: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    })
                )
            )
            .then((result) => {
                try {
                    console.log('********Tạo đơn, flow, ship thành công********')
                    let orderIds = []
                    let productOrderIds = []
                    let orderFlowIds = []
                    let orderVoucherIds = []
                    let orderShippingIds = []

                    result.forEach((order) => {
                        orderIds.push(order.id)
                        productOrderIds.push(...order.ProductOrder.map((product) => product.id))
                        orderFlowIds.push(order.OrderFlow[0].id)
                        orderVoucherIds.push(...order.OrderVoucher.map((voucher) => voucher.id))
                        orderShippingIds.push(order.OrderShipping[0].id)
                    })

                    let hashValue = hash('order', body.actionId)
                    const roll_back_job = new CronJob(CronExpression.EVERY_SECOND, async () => {
                        await this.prisma.$transaction(async (tx) => {
                            console.log('tien hanfh chay cron job roll back order')
                            try {
                                await Promise.all([
                                    tx.productOrder.deleteMany({
                                        where: {
                                            id: {
                                                in: productOrderIds
                                            }
                                        }
                                    }),
                                    tx.orderFlow.deleteMany({
                                        where: {
                                            id: {
                                                in: orderFlowIds
                                            }
                                        }
                                    }),
                                    tx.orderVoucher.deleteMany({
                                        where: {
                                            id: {
                                                in: orderVoucherIds.length
                                                    ? orderFlowIds
                                                    : undefined
                                            }
                                        }
                                    }),
                                    tx.orderShipping.deleteMany({
                                        where: {
                                            id: {
                                                in: orderShippingIds
                                            }
                                        }
                                    })
                                ])
                                await tx.order.deleteMany({
                                    where: {
                                        id: {
                                            in: orderIds
                                        }
                                    }
                                })
                            } catch (err) {
                                console.log('Lỗi trong roll_back_job')
                                throw new Error(err)
                            }
                        })
                    })
                    roll_back_job.runOnce = true
                    this.schedulerRegistry.addCronJob(hashValue, roll_back_job)

                    this.productClient.emit(updateQuantityProducts, { user, body } as OrderPayload)
                } catch (err) {
                    console.log('*******Lỗi ở then ở bước tạo order (LINE 479) **********', err)
                }
            })
            .catch((err) => {
                console.log('******Gặp lại ở ngay bước đầu tạo order (LINE 485) *********', err)
                this.updateStatusOfOrderToClient(
                    body.actionId,
                    'Tạo đơn hàng không thành công',
                    false,
                    null
                )
            })
    }

    async rollbackOrder(actionId: string) {
        try {
            console.log('roll back order')
            let hashValue = hash('order', actionId)
            const job = this.schedulerRegistry.getCronJob(hashValue)
            if (job) {
                job.start()
            }
        } catch (err) {
            console.log('*******Roll back order gặp lỗi (LINE 503) ********', err)
        }
    }

    async commitOrder(actionId: string) {
        try {
            console.log('commit order')
            let hashValue = hash('order', actionId)
            const job = this.schedulerRegistry.getCronJob(hashValue)
            if (job) {
                this.schedulerRegistry.deleteCronJob(hashValue)
            }
        } catch (err) {
            console.log('********Lỗi ở commit order (LINE 515)*********', err)
        }
    }

    async updateStatusOfOrderFlow(
        user: CurrentUserType | CurrentStoreType,
        orderId: string,
        body: UpdateStatusOrderFlow
    ): Promise<Return> {
        try {
            let isStoreType = (
                obj: CurrentUserType | CurrentStoreType
            ): obj is CurrentStoreType => {
                return 'userId' in obj
            }

            let userId = undefined
            let key = ''

            if (isStoreType(user)) {
                userId = user.storeId
                key = 'storeId'
            } else {
                userId = user.id
                key = 'userId'
            }

            const { status, note, orderRefundId } = body

            const orderExist = await this.prisma.order.findUnique({
                where: {
                    id: orderId,
                    [key]: userId
                },
                select: {
                    storeId: true,
                    id: true,
                    status: true,
                    createdAt: true
                }
            })

            if (!orderExist) throw new NotFoundException('Đơn hàng không tồn tại')

            if (
                status === OrderFlowEnum.CLIENT_CANCEL &&
                orderExist.status === OrderFlowEnum.FINISH
            ) {
                throw new BadRequestException('Không thể hủy đơn hàng đang được vận chuyển')
            }

            if (orderExist.status === OrderFlowEnum.FINISH) {
                throw new BadRequestException('Không thể cập nhật đơn hàng đã thành công')
            }

            let updateStatus = (
                tx: Omit<
                    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
                    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
                >,
                orderId: string,
                status: string
            ) => {
                return Promise.all([
                    tx.order.update({
                        where: {
                            id: orderId
                        },
                        data: {
                            status
                        }
                    }),
                    tx.orderFlow.create({
                        data: {
                            id: uuidv4(),
                            orderId,
                            status,
                            note,
                            createdAt: new Date(),
                            createdBy: userId
                        }
                    })
                ])
            }

            if (
                [OrderFlowEnum.CLIENT_CANCEL, OrderFlowEnum.ACCEPT_CANCEL].includes(status as any)
            ) {
                await this.prisma.$transaction(async (tx) => {
                    const [products, voucherIds] = await Promise.all([
                        tx.productOrder.findMany({
                            where: {
                                orderId
                            },
                            select: {
                                productId: true,
                                quantity: true
                            }
                        }),
                        tx.orderVoucher.findMany({
                            where: {
                                orderId
                            },
                            select: {
                                voucherId: true
                            }
                        })
                    ])
                    await updateStatus(tx, orderId, status)
                    try {
                        const [updatedProduct, updatedVoucher] = await Promise.all([
                            firstValueFrom<MessageReturn>(
                                this.productClient.send(updateQuantiyProductsWhenCancelOrder, {
                                    storeId: orderExist.storeId,
                                    products
                                })
                            ),
                            firstValueFrom<MessageReturn>(
                                this.storeClient.send(updateVoucherWhenCancelOrder, {
                                    storeId: orderExist.storeId,
                                    voucherIds
                                })
                            )
                        ])

                        console.log('update voucher', updatedVoucher)

                        if (!updatedProduct.action) {
                            throw new Error(updatedProduct.msg)
                        }

                        if (!updatedVoucher.action) {
                            throw new Error(updatedVoucher.msg)
                        }
                    } catch (err) {
                        console.log('error', err)
                        let storeId = orderExist.storeId
                        this.productClient.emit(rollbackUpdateQuantiyProductsWhenCancelOrder, {
                            storeId,
                            products
                        })
                        this.storeClient.emit(rollbackUpdateVoucherWhenCancelOrder, {
                            storeId,
                            voucherIds
                        })
                        throw new Error('Lỗi cập nhật trạng thái')
                    }
                })
            } else if (NormalStatus?.[status]) {
                await this.prisma.$transaction(async (tx) => {
                    await updateStatus(tx, orderId, status)
                })
            } else if (RefundStatus?.[status]) {
                if (!orderRefundId) {
                    throw new BadRequestException('Id của đơn hoàn đổi là bắt buộc')
                }

                await this.prisma.$transaction(async (tx) => {
                    try {
                        await updateStatus(tx, orderId, status)
                        let arr = []
                        if (status === OrderFlowEnum.CLOSE_REFUND) {
                            arr.push(
                                ...[OrderFlowEnum.CLOSE_REFUND, OrderFlowEnum.FINISH].map(
                                    (status) =>
                                        tx.orderFlow.create({
                                            data: {
                                                id: uuidv4(),
                                                status,
                                                orderId,
                                                createdAt:
                                                    status === OrderFlowEnum.FINISH
                                                        ? add(new Date(), { seconds: 10 })
                                                        : new Date(),
                                                createdBy: userId
                                            }
                                        })
                                )
                            )
                            arr.push(
                                tx.order.update({
                                    where: {
                                        id: orderId
                                    },
                                    data: {
                                        updatedAt: new Date(),
                                        status: OrderFlowEnum.FINISH
                                    }
                                })
                            )
                            arr.push(
                                tx.orderRefund.update({
                                    where: {
                                        id: orderRefundId
                                    },
                                    data: {
                                        status: OrderFlowEnum.FINISH,
                                        updatedAt: add(new Date(), { seconds: 10 })
                                    }
                                })
                            )
                        }

                        await Promise.all([
                            tx.orderRefund.update({
                                where: {
                                    id: orderRefundId
                                },
                                data: {
                                    status
                                }
                            }),
                            ...arr
                        ])
                    } catch (err) {
                        throw new BadRequestException('Cập nhật trạng thái thất bại')
                    }
                })
            }
            return {
                msg: 'Cập nhật trạng thái thành công',
                result: undefined
            }
        } catch (err) {
            console.log('error', err)
            throw new HttpException(
                (err?.message as string).length > 100 ? 'Lỗi server' : err?.message || 'Lỗi server',
                err?.statusCode || 500
            )
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
                        in: [
                            OrderFlowEnum.SHIPING_SUCCESS,
                            OrderFlowEnum.REFUND_SHIPPING_SUCCESS,
                            OrderFlowEnum.CANCEL_REFUND
                        ]
                    }
                },
                select: {
                    id: true,
                    createdAt: true,
                    numberOfRefund: true
                }
            })

            if (!orderExist) {
                throw new BadRequestException(
                    'Đơn hàng không tồn tại hoặc chưa được vận chuyển đến khách hàng'
                )
            }

            if (isPast(add(orderExist.createdAt, { days: 3 }))) {
                throw new BadRequestException(
                    'Không thể yêu cầu hoàn đổi khi đơn hàng đã quá 3 ngày'
                )
            }

            if (!orderExist.numberOfRefund) {
                throw new BadRequestException(
                    'Giới hạn 3 lần tạo đơn hoàn đổi. Bạn đã sử dụng hết lượt hoàn đổi'
                )
            }

            const orderRefundId = uuidv4()

            await this.prisma.$transaction(async (tx) => {
                return await Promise.all([
                    tx.orderRefund.create({
                        data: {
                            id: orderRefundId,
                            title,
                            description,
                            createdBy: userId,
                            orderId,
                            status: OrderFlowEnum.REQUEST_REFUND,
                            createdAt: new Date(),
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
                            status: OrderFlowEnum.REQUEST_REFUND,
                            createdAt: new Date(),
                            createdBy: userId,
                            orderRefundId
                        }
                    }),
                    tx.order.update({
                        where: {
                            id: orderId
                        },
                        data: {
                            status: OrderFlowEnum.REQUEST_REFUND,
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
            console.log('error', err)
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
                    status: OrderFlowEnum.REQUEST_REFUND
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
                            status: OrderFlowEnum.UPDATE_REFUND,
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
                            status: OrderFlowEnum.UPDATE_REFUND,
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

    async reopenOrderRefund(orderRefundId: string, body: ReOpenOrderRefundDTO): Promise<Return> {
        try {
            const orderRefundExist = await this.prisma.orderRefund.findUnique({
                where: {
                    id: orderRefundId,
                    status: OrderFlowEnum.REFUND_SHIPPING_SUCCESS
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

            const orderFlowRefund = await this.prisma.orderFlow.findFirst({
                where: {
                    orderId: orderRefundExist.orderId,
                    status: OrderFlowEnum.REFUND_SHIPPING_SUCCESS
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 1
            })

            if (!orderFlowRefund) {
                throw new NotFoundException('Không tìm thấy đơn hoàn đổi hợp lệ')
            }

            if (compareDesc(orderFlowRefund.createdAt, sub(new Date(), { days: 3 }))) {
                throw new BadRequestException(
                    'Đã hết thời gian hoàn đổi. Thời gian hoản đổi phải dưới 3 ngày'
                )
            }

            if (!orderRefundExist.Order.numberOfRefund) {
                throw new BadRequestException('Bạn đã hết lượt hoàn đổi. Hoàn đổi tối đa 3 lần')
            }

            let { description, materials, title } = body

            await this.prisma.$transaction([
                this.prisma.orderRefund.update({
                    where: {
                        id: orderRefundId
                    },
                    data: {
                        status: OrderFlowEnum.RE_OPEN_REFUND
                    }
                }),
                this.prisma.order.update({
                    where: {
                        id: orderRefundExist.orderId
                    },
                    data: {
                        status: OrderFlowEnum.REQUEST_REFUND,
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
                        status: OrderFlowEnum.REQUEST_REFUND,
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
                        status: OrderFlowEnum.RE_OPEN_REFUND,
                        createdBy: orderRefundExist.createdBy,
                        orderId: orderRefundExist.orderId
                    }
                }),
                this.prisma.orderFlow.create({
                    data: {
                        id: uuidv4(),
                        status: OrderFlowEnum.REQUEST_REFUND,
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
                    status: OrderFlowEnum.FINISH,
                    storeId: user.storeId
                }
            }),
            this.prisma.order.count({
                where: {
                    status: OrderFlowEnum.WAITING_CONFIRM,
                    storeId: user.storeId
                }
            }),
            this.prisma.order.count({
                where: {
                    status: OrderFlowEnum.SHIPING_SUCCESS,
                    storeId: user.storeId
                }
            }),
            this.prisma.order.count({
                where: {
                    status: OrderFlowEnum.REQUEST_REFUND,
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
                status: OrderFlowEnum.FINISH
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
