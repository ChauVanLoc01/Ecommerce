/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common'
import { ProductsModule } from './products.module'
import { ConfigModule } from '@app/common'

@Module({
  imports: [ConfigModule, ProductsModule]
})
export class ProductMainModule {}
