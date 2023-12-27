import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { CurrentUserType } from 'common/types/current.type'
import { CreateOrderDTO } from '../dtos/create_order.dto'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UpdateOrderDTO } from '../dtos/update_order.dto'

@UseGuards(JwtGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @ApiBearerAuth()
  @Roles(Role.USER, Role.EMPLOYEE, Role.STORE_OWNER)
  @Get()
  getProductAll(@CurrentUser() user: CurrentUserType) {
    return this.ordersService.getAll(user.id)
  }

  @ApiBearerAuth()
  @Roles(Role.USER, Role.EMPLOYEE, Role.STORE_OWNER)
  @Get(':orderId')
  getOrderDetail(@Param('orderId') orderId: string) {
    return this.ordersService.getProductDetail(orderId)
  }

  @ApiBearerAuth()
  @Roles(Role.USER)
  @Post()
  createOrder(
    @CurrentUser() user: CurrentUserType,
    @Body() body: CreateOrderDTO
  ) {
    return this.ordersService.createOrder(user.id, body)
  }

  @Put(':orderId')
  updateOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: CurrentUserType,
    @Body() body: UpdateOrderDTO
  ) {
    return this.ordersService.updateOrder(user, orderId, body)
  }
}
