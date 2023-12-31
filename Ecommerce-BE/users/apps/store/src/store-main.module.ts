import { ConfigModule } from '@app/common'
import { Module } from '@nestjs/common'
import { StoreModule } from './Store/store.module'
import { ProductManagementModule } from './ProductManagement/pro_mana.module'
import { UserManagementModule } from './UserManagement/user_mana.module'
import { VoucherManagementModule } from './VoucherManagement/voucher_mana.module'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule,
    StoreModule,
    ProductManagementModule,
    UserManagementModule,
    VoucherManagementModule
  ],
  controllers: [],
  providers: []
})
export class StoreMainModule {}
