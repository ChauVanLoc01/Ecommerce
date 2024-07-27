import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ApiBearerAuth } from '@nestjs/swagger'
import {
    commit_order,
    getOrderByRating,
    processStepOneToCreatOrder,
    processStepTwoToCreateOrder,
    roll_back_order
} from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { CreateOrderPayload } from 'common/types/order_payload.type'
import { CreateOrderDTO } from '../../../../common/dtos/create_order.dto'
import {
    CreateOrderRefundDTO,
    ReOpenOrderRefundDTO,
    UpdateOrderRefundDTO,
    UpdateStatusOrderFlow
} from '../dtos/order_refund.dto'
import { QueryOrderDTO } from '../dtos/query-order.dto'
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

    // @Roles(Role.STORE_OWNER)
    // @Get('receipt-analytic/:type')
    // receiptAnalyticByDate(
    //     @CurrentUser() user: CurrentStoreType,
    //     @Param('type') type: AnalyticsType
    // ) {
    //     return this.ordersService.receiptAnalyticByDate(user, body)
    // }

    // @Roles(Role.STORE_OWNER)
    // @Post('order-analytic')
    // orderAnalyticByDate(@CurrentUser() user: CurrentStoreType, @Body() body: AnalyticsOrderDTO) {
    //     return this.ordersService.orderAnalyticByDate(user, body)
    // }

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
    @EventPattern(processStepOneToCreatOrder)
    checkCache(@Ctx() context: RmqContext, @Payload() payload: CreateOrderPayload<'check_cache'>) {
        return this.ordersService.checkCache(payload.userId, payload.payload, context)
    }

    @Public()
    @EventPattern(processStepTwoToCreateOrder)
    processOrder(@Payload() data: CreateOrderPayload<'process_order'>, @Ctx() context: RmqContext) {
        return this.ordersService.processOrder(data.userId, data.payload, context)
    }

    @Public()
    @EventPattern(roll_back_order)
    rollbackOrder(
        @Payload() payload: CreateOrderPayload<'roll_back_order'>,
        @Ctx() context: RmqContext
    ) {
        console.log('roll back order nhận được thông tin')
        return this.ordersService.rollbackOrder(payload, context)
    }

    @Public()
    @EventPattern(commit_order)
    commitOrder(
        @Payload() payload: CreateOrderPayload<'commit_success'>,
        @Ctx() context: RmqContext
    ) {
        return this.ordersService.commitOrder(payload, context)
    }

    @Roles(Role.USER, Role.EMPLOYEE, Role.STORE_OWNER)
    @Put(':orderId/status')
    updateStatusOfOrderFlow(
        @CurrentUser() user: CurrentUserType | CurrentStoreType,
        @Param('orderId') orderId: string,
        @Body() body: UpdateStatusOrderFlow
    ) {
        return this.ordersService.updateStatusOfOrderFlow(user, orderId, body)
    }

    @Roles(Role.USER)
    @Post(':orderId/refund')
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
