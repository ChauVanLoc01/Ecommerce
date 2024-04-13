import { StorageController } from './storage.controller'
import { Module } from '@nestjs/common'

@Module({
  imports: [],
  controllers: [StorageController],
  providers: []
})
export class StorageModule {}
