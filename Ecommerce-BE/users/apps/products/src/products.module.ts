import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { ConfigModule } from '@app/common'

@Module({
  imports: [ConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
