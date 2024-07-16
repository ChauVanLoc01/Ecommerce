import { PrismaService } from '@app/common/prisma/prisma.service'
import { InjectQueue } from '@nestjs/bull'
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
import { SchedulerRegistry } from '@nestjs/schedule'
import { Prisma, PrismaClient, Product } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { Queue } from 'bull'
import { Cache } from 'cache-manager'
import { BackgroundAction, BackgroundName } from 'common/constants/background-job.constant'
import {
    getAllProductWithProductOrder,
    processStepOneToCreatOrder,
    processStepTwoToCreateOrder,
    rollbackUpdateQuantiyProductsWhenCancelOrder,
    rollbackUpdateVoucherWhenCancelOrder,
    statusOfOrder,
    updateQuantiyProductsWhenCancelOrder,
    updateVoucherWhenCancelOrder
} from 'common/constants/event.constant'
import { NormalStatus, OrderFlowEnum, RefundStatus } from 'common/enums/orderStatus.enum'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { CreateOrderPayload } from 'common/types/order_payload.type'
import { MessageReturn, Return } from 'common/types/result.type'
import { emit_update_status_of_order, hash, product_next_step } from 'common/utils/order_helper'
import { add, addHours, compareDesc, format, isPast, sub, subDays } from 'date-fns'
import { Dictionary, isUndefined, max, omitBy, sumBy } from 'lodash'
import { firstValueFrom } from 'rxjs'
import { v4 as uuidv4 } from 'uuid'
import { CreateOrder, CreateOrderDTO } from '../../../../common/dtos/create_order.dto'
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
        private schedulerRegistry: SchedulerRegistry,
        @InjectQueue(BackgroundName.order) private orderBackgroundQueue: Queue
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
                    status,
                    isDraf: false
                }
            }),
            this.prisma.order.findMany({
                where: {
                    userId: id,
                    createdAt: {
                        lte: end_date,
                        gte: start_date
                    },
                    status,
                    isDraf: false
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
        this.orderClient.emit(processStepOneToCreatOrder, {
            userId: user.id,
            payload: body
        } as CreateOrderPayload<'check_cache'>)
        return {
            msg: 'Đơn hàng đang được xử lý',
            result: null
        }
    }

    async checkCache(userId: string, payload: CreateOrder) {
        let { orders, actionId } = payload
        console.log(':::::::::Kiểm tra cache:::::::::', format(new Date(), 'hh:mm:ss:SSS dd/MM'))
        try {
            const result = await Promise.all(
                orders.map(async ({ voucherId, productOrders }) => {
                    if (voucherId) {
                        let hashValue = hash('voucher', voucherId)
                        let quantityVoucherCache = await this.cacheManager.get<string>(hashValue)
                        if (quantityVoucherCache) {
                            let { quantity } = JSON.parse(quantityVoucherCache) as {
                                quantity: number
                            }
                            if (quantity == 0) {
                                throw new Error('Mã giảm giá đã hết lượt sử dụng')
                            }
                        }
                    }
                    await Promise.all(
                        productOrders.map(async ({ productId, quantity }) => {
                            let hashProductId = hash('product', productId)
                            let fromCache = await this.cacheManager.get<string>(hashProductId)
                            if (fromCache) {
                                let { quantity: quantityFromCache } = JSON.parse(fromCache) as {
                                    quantity: number
                                }
                                if (quantityFromCache == 0) {
                                    throw new Error('Sản phẩm đã hết hàng')
                                }
                                if (quantity > quantityFromCache) {
                                    throw new Error('Sản phẩm không đủ số lượng')
                                }
                            }
                            return true
                        })
                    )
                    return true
                })
            )
            if (result) {
                console.log(
                    '::::::::::Kiểm tra cache thành công ==> Tiến hành tạo đơn với mode là Draft::::::::::',
                    format(new Date(), 'hh:mm:ss:SSS dd/MM')
                )
                this.orderClient.emit(processStepTwoToCreateOrder, {
                    userId,
                    payload
                } as CreateOrderPayload<'process_order'>)
            }
        } catch (err) {
            console.log('*****Lỗi tại bước check cache********', err)
            emit_update_status_of_order(this.socketClient, {
                action: false,
                id: actionId,
                msg: err.message,
                result: null
            })
        }
    }

    async processOrder(userId: string, body: CreateOrder) {
        const { orders, globalVoucherId, delivery_info, currentSaleId } = body
        console.log(
            ':::::::::::Tiến hành tạo đơn, shipping::::::::::::',
            format(new Date(), 'hh:mm:ss:SSS dd/MM')
        )
        let tmp: CreateOrderPayload<'update_product'>['payload'] = {
            orderIds: [],
            products: [],
            vouchers: []
        }
        try {
            const result = await this.prisma.$transaction(
                orders.map((order) => {
                    let orderId = uuidv4()
                    tmp.orderIds.push(orderId)

                    let produtOrderCreate: Prisma.OrderCreateInput['ProductOrder'] = {
                        createMany: {
                            data: order.productOrders.map(
                                ({ productId, quantity, isSale, priceAfter, priceBefore }) => {
                                    tmp.products.push({
                                        buy: quantity,
                                        remaining_quantity: 0,
                                        id: productId,
                                        original_quantity: 0,
                                        price_after: priceAfter,
                                        storeId: order.storeId,
                                        currentSaleId
                                    })
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
                    }

                    let voucherIds = [order.voucherId, globalVoucherId].filter(Boolean)
                    let createVoucherOrders: Prisma.OrderCreateInput['OrderVoucher'] = undefined
                    if (voucherIds.length) {
                        tmp.vouchers.push(
                            ...voucherIds.map((id) => ({ id, storeId: order.storeId }))
                        )
                        let voucherOrderIds = Array(voucherIds.length).fill(uuidv4())
                        createVoucherOrders = {
                            createMany: {
                                data: voucherIds.map((voucherId, idx) => ({
                                    id: voucherOrderIds[idx],
                                    createdAt: new Date(),
                                    voucherId
                                }))
                            }
                        }
                    }

                    return this.prisma.order.create({
                        data: {
                            id: orderId,
                            total: order.total,
                            discount: order.discount,
                            pay: order.pay,
                            status: OrderFlowEnum.WAITING_CONFIRM,
                            storeId: order.storeId,
                            note: order.note,
                            userId,
                            createdAt: new Date(),
                            ProductOrder: produtOrderCreate,
                            OrderShipping: {
                                create: {
                                    id: uuidv4(),
                                    address: delivery_info.address,
                                    name: delivery_info.name,
                                    type: OrderFlowEnum.WAITING_CONFIRM,
                                    createdBy: userId
                                }
                            },
                            OrderFlow: {
                                create: {
                                    id: uuidv4(),
                                    status: OrderFlowEnum.WAITING_CONFIRM,
                                    createdBy: userId,
                                    createdAt: new Date()
                                }
                            },
                            OrderVoucher: createVoucherOrders
                        }
                    })
                })
            )

            if (result) {
                console.log(
                    ':::::::Success: Tạo đơn thành công ==> chuyển tới bước cập nhật product::::::::',
                    format(new Date(), 'hh:mm:ss:SSS dd/MM')
                )
                product_next_step(this.productClient, {
                    actionId: body.actionId,
                    userId,
                    payload: tmp
                })
            }
        } catch (err) {
            console.log(
                '******Fail: Tạo đơn thất bại ==> Emit thông tin tạod dơn thất bại tới người dùng*********',
                err
            )
            emit_update_status_of_order(this.socketClient, {
                action: true,
                id: body.actionId,
                msg: err?.message,
                result: null
            })
            console.log(
                ':::::::::::Emit thông tin đơn hàng thất bại tới người dùng thành công::::::::::::'
            )
        }
    }

    async rollbackOrder(body: CreateOrderPayload<'roll_back_order'>) {
        let {
            payload: { orderIds }
        } = body
        console.log(
            '*********Tiến hành roll back lại order ==> Xóa order và các bảng liên quan****************',
            format(new Date(), 'hh:mm:ss:SSS dd/MM')
        )
        try {
            await this.orderBackgroundQueue.add(BackgroundAction.rollBackOrder, orderIds, {
                attempts: 3,
                removeOnComplete: true
            })
            console.log(':::::::::Success: Gọi backgound job để xử lý rollback order::::::::::::')
        } catch (err) {
            console.log('*******Fail: Roll back order gặp lỗi********', err)
        }
    }

    async commitOrder(body: CreateOrderPayload<'commit_success'>) {
        console.log(
            '::::::::::Commit order ==> Product hoặc voucher đã cập nhật thành công ==> Quá trình đặt hàng thành công::::::::::::',
            format(new Date(), 'hh:mm:ss:SSS dd/MM')
        )
        let {
            payload: { orderIds },
            actionId
        } = body
        try {
            console.log('::::::::::Success: Gọi background job để commit order::::::::::::')
            await this.orderBackgroundQueue.add(
                BackgroundAction.reUpdateIsDrafOrder,
                {
                    orderIds,
                    actionId
                },
                {
                    attempts: 3,
                    removeOnComplete: true
                }
            )
        } catch (err) {
            console.log('********Fail: Lỗi khởi tạo background job để remove isDraf*********', err)
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
