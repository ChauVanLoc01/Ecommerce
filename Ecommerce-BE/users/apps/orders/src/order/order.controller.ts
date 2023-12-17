import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { OrderService } from './order.service'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { CurrentUserType } from 'common/types/current.type'
import { CreateOrderDTO } from '../dtos/create_order.dto'

@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @Get()
  getAll(@CurrentUser() user: CurrentUserType) {
    return this.ordersService.getAll(user.id)
  }

  @Get(':orderId')
  getOne(
    @CurrentUser() user: CurrentUserType,
    @Param('orderId') orderId: string
  ) {
    return this.ordersService.getOne(user.id, orderId)
  }

  @Post()
  create(@CurrentUser() user: CurrentUserType, @Body() body: CreateOrderDTO) {
    return this.ordersService.create(user.id, body)
  }

  // @Put(':orderId')
  // update(@CurrentUser() user: CurrentUserType, @Body() body: updateOrderDTO) {
  //   return this.ordersService.update();
  // }
}
