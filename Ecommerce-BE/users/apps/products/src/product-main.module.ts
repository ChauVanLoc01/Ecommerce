import { Module } from '@nestjs/common'
import { ConfigModule } from '@app/common'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [ConfigModule, ProductModule, CategoryModule],
  providers: [JwtService]
})
export class ProductMainModule {}
