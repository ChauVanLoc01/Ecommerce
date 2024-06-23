import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { ApiBearerAuth } from '@nestjs/swagger'
import { getOrderByRating, processOrder } from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { AnalyticsOrderDTO } from '../dtos/analytics_order.dto'
import { CreateOrderDTO, CreateOrderType } from '../dtos/create_order.dto'
import { QueryOrderDTO } from '../dtos/query-order.dto'
import { UpdateOrderDTO, UpdateStatusOrderDTO } from '../dtos/update_order.dto'
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

    @Roles(Role.STORE_OWNER)
    @Put('store-order/:orderId')
    updateStatusByStore(
        @CurrentUser() user: CurrentStoreType,
        @Param('orderId') orderId: string,
        @Body() body: UpdateStatusOrderDTO
    ) {
        return this.ordersService.updateStatusByStore(user, orderId, body)
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
    @EventPattern(processOrder)
    processOrder(data: { user: CurrentUserType; body: CreateOrderType }) {
        return this.ordersService.processOrder(data.user, data.body)
    }

    @Roles(Role.USER)
    @Put('user-order/:orderId')
    updateOrder(
        @Param('orderId') orderId: string,
        @CurrentUser() user: CurrentUserType,
        @Body() body: UpdateOrderDTO
    ) {
        return this.ordersService.updateOrder(user, orderId, body)
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
