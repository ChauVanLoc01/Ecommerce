import { ProductManagementService } from './pro_mana.service'
import { Module } from '@nestjs/common'
import { ProductManagementController } from './pro_mana.controller'

@Module({
  imports: [],
  controllers: [ProductManagementController],
  providers: [ProductManagementService]
})
export class ProductManagementModule {}
