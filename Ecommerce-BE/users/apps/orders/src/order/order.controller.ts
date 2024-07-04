import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { ApiBearerAuth } from '@nestjs/swagger'
import {
    commitOrder,
    getOrderByRating,
    processStepOneToCreatOrder,
    processStepTwoToCreateOrder,
    rollbackOrder
} from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { OrderPayload } from 'common/types/order_payload.type'
import { CreateOrderDTO } from '../../../../common/dtos/create_order.dto'
import { AnalyticsOrderDTO } from '../dtos/analytics_order.dto'
import {
    AcceptRequestOrderRefundDTO,
    CloseOrderRefundDTO,
    CreateOrderRefundDTO,
    ReOpenOrderRefundDTO,
    UpdateOrderRefundDTO
} from '../dtos/order_refund.dto'
import { QueryOrderDTO } from '../dtos/query-order.dto'
import { UpdateOrderDTO } from '../dtos/update_order.dto'
import { OrderService } from './order.service'

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
    constructor(private readonly ordersService: OrderService) {}

    @Public()
    @Get('done')
    doneTask() {
        return this.ordersService.doneTask()
    }

    @ApiBearerAuth()
    @Roles(Role.USER)
    @Get('user-order')
    getAllOrderByUser(@CurrentUser() user: CurrentUserType, @Query() query: QueryOrderDTO) {
        return this.ordersService.getAllOrderByUser(user, query)
    }

    @Roles(Role.USER)
    @Get('user-order/:orderId')
    getOrderDetailByUser(@CurrentUser() user: CurrentUserType, @Param('orderId') orderId: string) {
        return this.ordersService.getOrderDetailByUser(user, orderId)
    }

    // Store management

    @Roles(Role.STORE_OWNER, Role.ADMIN, Role.EMPLOYEE)
    @Get('store-order')
    getAllOrderByStore(@CurrentUser() user: CurrentStoreType, @Query() query: QueryOrderDTO) {
        return this.ordersService.getAllOrderByStore(user, query)
    }

    @Roles(Role.STORE_OWNER)
    @Post('receipt-analytic')
    receiptAnalyticByDate(@CurrentUser() user: CurrentStoreType, @Body() body: AnalyticsOrderDTO) {
        return this.ordersService.receiptAnalyticByDate(user, body)
    }

    @Roles(Role.STORE_OWNER)
    @Post('order-analytic')
    orderAnalyticByDate(@CurrentUser() user: CurrentStoreType, @Body() body: AnalyticsOrderDTO) {
        return this.ordersService.orderAnalyticByDate(user, body)
    }

    @Roles(Role.STORE_OWNER, Role.ADMIN, Role.EMPLOYEE)
    @Get('store-order-status/:orderId')
    getOrderStatusByStore(
        @CurrentUser() user: CurrentStoreType,
        @Param('orderId') orderId: string
    ) {
        return this.ordersService.getOrderStatusByStore(user, orderId)
    }

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER, Role.ADMIN)
    @Get('store-order/:orderId')
    getOrderDetailByStore(
        @CurrentUser() user: CurrentStoreType,
        @Param('orderId') orderId: string
    ) {
        return this.ordersService.getOrderDetailByStore(user, orderId)
    }

    // @Roles(Role.STORE_OWNER)
    // @Put('store-order/:orderId')
    // updateStatusByStore(
    //     @CurrentUser() user: CurrentStoreType,
    //     @Param('orderId') orderId: string,
    //     @Body() body: UpdateStatusOrderDTO
    // ) {
    //     return this.ordersService.updateStatusByStore(user, orderId, body)
    // }

    @Roles(Role.ADMIN, Role.EMPLOYEE, Role.STORE_OWNER)
    @Get('store-order-analytics')
    analyticOrderStore(@CurrentUser() user: CurrentStoreType) {
        return this.ordersService.analyticOrderStore(user)
    }

    // User Order
    @Roles(Role.USER)
    @Post('user-order')
    createOrder(@CurrentUser() user: CurrentUserType, @Body() body: CreateOrderDTO) {
        return this.ordersService.createOrder(user, body)
    }

    @Public()
    @EventPattern()
    @MessagePattern(processStepOneToCreatOrder)
    checkCache(@Payload() payload: OrderPayload) {
        return this.ordersService.checkCache(payload.user, payload.body)
    }

    @Public()
    @EventPattern(processStepTwoToCreateOrder)
    processOrder(data: OrderPayload) {
        return this.ordersService.processOrder(data.user, data.body)
    }

    @Public()
    @EventPattern(rollbackOrder)
    rollbackOrder(actionId: string) {
        return this.ordersService.rollbackOrder(actionId)
    }

    @Public()
    @EventPattern(commitOrder)
    commitOrder(actionId: string) {
        return this.ordersService.commitOrder(actionId)
    }

    @Roles(Role.USER)
    @Put('user-order/:orderId/cancel')
    cancelOrder(
        @Param('orderId') orderId: string,
        @CurrentUser() user: CurrentUserType,
        @Body() body: UpdateOrderDTO
    ) {
        return this.ordersService.cancelOrder(user, orderId, body)
    }

    @Roles(Role.USER)
    @Post('user-order/:orderId/refund')
    requestRefund(
        @CurrentUser() user: CurrentUserType,
        @Param('orderId') orderId: string,
        @Body() body: CreateOrderRefundDTO
    ) {
        return this.ordersService.requestRefund(user, orderId, body)
    }

    @Roles(Role.USER)
    @Put('user-order/:orderRefundId/refund')
    updateRequestRefund(
        @Param('orderRefundId') orderRefundId: string,
        @Body() body: UpdateOrderRefundDTO
    ) {
        return this.ordersService.updateRequestRefund(orderRefundId, body)
    }

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
    @Post('store-order/:orderRefundId/refund/accept')
    acceptRequestRefund(
        @CurrentUser() store: CurrentStoreType,
        @Param('orderRefundId') orderRefundId: string,
        @Body() body: AcceptRequestOrderRefundDTO
    ) {
        return this.ordersService.acceptRequestRefund(store, orderRefundId, body)
    }

    @Roles(Role.USER)
    @Post('user-order/:orderRefundId/refund/close')
    closeRequestRefund(
        @Param('orderRefundId') orderRefundId: string,
        @Body() body: CloseOrderRefundDTO
    ) {
        return this.ordersService.closeRequestRefund(orderRefundId, body)
    }

    @Roles(Role.USER)
    @Post('user-order/:orderRefundId/refund/reopen')
    reopenOrderRefund(
        @Param('orderRefundId') orderRefundId: string,
        @Body() body: ReOpenOrderRefundDTO
    ) {
        return this.ordersService.reopenOrderRefund(orderRefundId, body)
    }

    // @Public()
    // @MessagePattern(checkVoucherExistInOrder)
    // checkVoucherInVoucher(@Payload() payload: string) {
    //   return this.ordersService.checkVoucherExistInVoucher(payload)
    // }

    @Public()
    @MessagePattern(getOrderByRating)
    getOrderValid(@Payload() payload: { userId: string; orderIds: string[] }) {
        return this.ordersService.orderWithoutRating(payload.userId, payload.orderIds)
    }
}
