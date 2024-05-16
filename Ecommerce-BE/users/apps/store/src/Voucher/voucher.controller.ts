import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { CurrentUser } from 'common/decorators/current_user.decorator'
import { JwtGuard } from 'common/guards/jwt.guard'
import { CurrentStoreType } from 'common/types/current.type'
import { CreateVoucherDTO } from './dtos/CreateVoucher.dto'
import { UpdateVoucherDTO } from './dtos/UpdateVoucher.dto'
import { VoucherService } from './voucher.service'
import { VoucherQueryDTO } from './dtos/QueryVoucher.dto'

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

  @Get()
  getAllVoucher(@CurrentUser() user: CurrentStoreType, @Body() query: VoucherQueryDTO) {
    return this.voucherService.getAllVoucher(user, query)
  }

  @Get(':voucherId')
  getDetail(@Param('voucherId') voucherId: string, @CurrentUser() user: CurrentStoreType) {
    return this.voucherService.getDetail(user, voucherId)
  }
}
