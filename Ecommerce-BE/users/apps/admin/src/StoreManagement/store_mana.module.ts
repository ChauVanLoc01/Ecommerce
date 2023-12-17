import { Module } from '@nestjs/common'
import { StoreManagementController } from './store_mana.controller';
import { StoreManagementService } from './store_mana.service';

@Module({
  imports: [],
  controllers: [StoreManagementController],
  providers: [StoreManagementService]
})
export class StoreManagementModule {}
