import { Module } from '@nestjs/common'
import { ProductManagementModule } from './ProductManagement/pro_mana.module'
import { StoreManagementModule } from './StoreManagement/store_mana.module'
import { UserManagementModule } from './UserManagement/user_mana.module'
import { VoucherManagementModule } from './VoucherManagement/voucher_mana.module'

@Module({
  imports: [
    ProductManagementModule,
    StoreManagementModule,
    UserManagementModule,
    VoucherManagementModule
  ],
  controllers: [],
  providers: []
})
export class AdminModule {}
