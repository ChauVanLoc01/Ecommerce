import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { ConfigModule } from '@app/common'
import { ProductController } from './product.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ProductsController, ProductController],
  providers: [ProductsService]
})
export class ProductsModule {}
