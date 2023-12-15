import { Module } from '@nestjs/common'
import { ConfigModule } from '@app/common'
import { ProductModule } from './product/product.module'

@Module({
  imports: [ConfigModule, ProductModule]
})
export class ProductMainModule {}
