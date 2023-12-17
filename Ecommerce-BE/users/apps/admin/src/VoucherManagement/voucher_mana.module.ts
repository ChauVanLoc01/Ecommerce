import { VoucherManagementService } from './voucher_mana.service'
import { VoucherManagementController } from './voucher_mana.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [VoucherManagementController],
  providers: [VoucherManagementService]
})
export class VoucherManagementModule {}
