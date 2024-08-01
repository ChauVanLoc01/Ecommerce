import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { ApiBearerAuth } from '@nestjs/swagger'
import {
    rollbackUpdateVoucherWhenCancelOrder,
    update_voucher_whenCreatingOrder,
    updateVoucherWhenCancelOrder
} from 'common/constants/event.constant'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { Public } from 'common/decorators/public.decorator'
import { Roles } from 'common/decorators/roles.decorator'
import { Role } from 'common/enums/role.enum'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { CreateOrderPayload } from 'common/types/order_payload.type'
import { format } from 'date-fns'
import { CreateVoucherDTO } from './dtos/CreateVoucher.dto'
import { QueryGlobalVoucherDTO } from './dtos/query_global_voucher.dto'
import { VoucherQueryDTO } from './dtos/QueryVoucher.dto'
import { SearchCodeDTO } from './dtos/search-code.dto'
import { UpdateVoucherDTO } from './dtos/UpdateVoucher.dto'
import { VoucherService } from './voucher.service'

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('voucher')
export class VoucherController {
    constructor(private readonly voucherService: VoucherService) {}

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
    @Get('category/:conditionalCategoryId')
    conditionalCategoryOfVoucher(@Param('conditionalCategoryId') conditionalCategoryId: string) {
        return this.voucherService.conditionalCategoryOfVoucher(conditionalCategoryId)
    }

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
    @Get('price/:conditionalPriceId')
    conditionalPriceOfVoucher(@Param('conditionalPriceId') conditionalPriceId: string) {
        return this.voucherService.conditionalPriceOfVoucher(conditionalPriceId)
    }

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

    @Roles(Role.ADMIN)
    @Get('global')
    getGlobalVoucher(@Query() query: QueryGlobalVoucherDTO) {
        return this.voucherService.getGlobalVoucher(query)
    }

    @Roles(Role.USER)
    @Get('global/user')
    getGlobalVoucherForUser() {
        return this.voucherService.getGlobalVoucherForUser()
    }

    @Roles(Role.EMPLOYEE, Role.STORE_OWNER)
    @Get()
    getAllVoucher(@CurrentUser() user: CurrentStoreType, @Query() query: VoucherQueryDTO) {
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
    @EventPattern(update_voucher_whenCreatingOrder)
    updateVoucherWhenCreatingOrder(body: CreateOrderPayload<'update_voucher'>) {
        console.log(
            '*********Bước 3: Câp nhật voucher*********',
            format(new Date(), 'hh:mm:ss:SSS dd/MM')
        )
        return this.voucherService.updateVoucherWhenCreatingOrder(body)
    }

    @Public()
    @MessagePattern(updateVoucherWhenCancelOrder)
    updateVoucherWhenCancelOrder(@Payload() payload: { storeId: string; voucherIds: string[] }) {
        return this.voucherService.updateVoucherWhenCancelOrder(payload)
    }

    @Public()
    @EventPattern(rollbackUpdateVoucherWhenCancelOrder)
    rollbackUpdateVoucherWhenCancelOrder(
        @Payload() payload: { storeId: string; voucherIds: string[] }
    ) {
        return this.voucherService.rollbackUpdateVoucherWhenCancelOrdere(payload)
    }
}
