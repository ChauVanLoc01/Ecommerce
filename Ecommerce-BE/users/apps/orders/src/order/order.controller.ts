import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards
} from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { CreateOrderDTO } from '../dtos/create_order.dto'
import { QueryOrderDTO } from '../dtos/query-order.dto'
import { UpdateOrderDTO } from '../dtos/update_order.dto'
import { OrderService } from './order.service'

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

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

  @Roles(Role.EMPLOYEE, Role.STORE_OWNER, Role.ADMIN)
  @Get('store-order')
  getAllOrderByStore(@CurrentUser() user: CurrentStoreType, @Query() query: QueryOrderDTO) {
    return this.ordersService.getAllOrderByStore(user, query)
  }

  @Roles(Role.EMPLOYEE, Role.STORE_OWNER, Role.ADMIN)
  @Get('store-order/:orderId')
  getOrderDetailByStore(@CurrentUser() user: CurrentStoreType, @Param('orderId') orderId: string) {
    return this.ordersService.getOrderDetailByStore(user, orderId)
  }

  @Roles(Role.USER)
  @Post('user-order')
  createOrder(@CurrentUser() user: CurrentUserType, @Body() body: CreateOrderDTO) {
    return this.ordersService.createOrder(user, body)
  }

  @Roles(Role.USER)
  @Put(':orderId')
  updateOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: CurrentUserType,
    @Body() body: UpdateOrderDTO
  ) {
    return this.ordersService.updateOrder(user, orderId, body)
  }

  @Public()
  @Get('hello')
  test() {
    return this.ordersService.test()
  }
}
