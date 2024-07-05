import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { ApiBearerAuth } from '@nestjs/swagger'
import {
    checkVoucherExistToCreateOrder,
    updateVoucherWhenCancelOrder
} from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { CreateVoucherDTO } from './dtos/CreateVoucher.dto'
import { VoucherQueryDTO } from './dtos/QueryVoucher.dto'
import { SearchCodeDTO } from './dtos/search-code.dto'
import { UpdateVoucherDTO } from './dtos/UpdateVoucher.dto'
import { VoucherService } from './voucher.service'
import { OrderPayload } from 'common/types/order_payload.type'

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Post()
    createVoucher(@CurrentUser() user: CurrentStoreType, @Body() body: CreateVoucherDTO) {
        return this.voucherService.createVoucher(user, body)
    }

    @Put(':voucherId')
    updateVoucher(
        @CurrentUser() user: CurrentStoreType,
        @Param('voucherId') voucherId: string,
        @Body() body: UpdateVoucherDTO
    ) {
        return this.voucherService.updateVoucher(user, voucherId, body)
    }

    @Get('user-store-voucher/:storeId')
    getUserVoucher(@CurrentUser() user: CurrentUserType, @Param('storeId') storeId: string) {
        return this.voucherService.getUserVoucherByStore(user, storeId)
    }

    @Get('user-global-voucher')
    getUserVoucherByGlobal(@CurrentUser() user: CurrentUserType) {
        return this.voucherService.getUserVoucherByGlobal(user)
    }

    @Get('analytics')
    voucherAnalytics(@CurrentUser() user: CurrentStoreType) {
        return this.voucherService.voucherAnalytics(user)
    }

    @Get()
    getAllVoucher(@CurrentUser() user: CurrentStoreType, @Body() query: VoucherQueryDTO) {
        return this.voucherService.getAllVoucher(user, query)
    }

    @Get(':voucherId')
    getDetail(@Param('voucherId') voucherId: string, @CurrentUser() user: CurrentStoreType) {
        return this.voucherService.getDetail(user, voucherId)
    }

    @Post('search-code')
    searchVoucherByCode(@Body() body: SearchCodeDTO) {
        return this.voucherService.searchVoucherByCode(body)
    }

    @Public()
    @EventPattern(checkVoucherExistToCreateOrder)
    checkVoucherExistToCreateOrder(body: OrderPayload & { productActionId: string }) {
        console.log('update quantity voucher')
        return this.voucherService.checkVoucherExistToCreateOrder(body)
    }

    // @Public()
    // @MessagePattern(updateVoucherWhenCancelOrder)
    // updateVoucherWhenCancelOrder(@Payload() payload: { orderId: string; storeId: string }) {
    //     return this.voucherService.updateVoucherWhenCancelOrder(payload.orderId, payload.storeId)
    // }
}
