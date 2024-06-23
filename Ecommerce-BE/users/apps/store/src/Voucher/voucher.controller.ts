import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType, CurrentUserType } from 'common/types/current.type'
import { CreateVoucherDTO } from './dtos/CreateVoucher.dto'
import { VoucherQueryDTO } from './dtos/QueryVoucher.dto'
import { UpdateVoucherDTO } from './dtos/UpdateVoucher.dto'
import { UserVoucherDTO } from './dtos/UserVoucher.dto'
import { VoucherService } from './voucher.service'
import { SearchCodeDTO } from './dtos/search-code.dto'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { checkVoucherExistToCreateOrder } from 'common/constants/event.constant'
import { Public } from 'common/decorators/public.decorator'

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
    @MessagePattern(checkVoucherExistToCreateOrder)
    checkVoucherExistToCreateOrder(
        @Payload()
        payload: string[]
    ) {
        return this.voucherService.checkVoucherExistToCreateOrder(payload)
    }
}
