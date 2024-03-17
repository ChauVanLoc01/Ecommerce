import { Module } from '@nestjs/common'
import { ConfigModule, PrismaModule } from '@app/common'
import { ProductModule } from './product/product.module'
import { CategoryModule } from './category/category.module'
import { JwtService } from '@nestjs/jwt'
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-redis-store'
import { ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('bullqueue.host'),
          port: configService.get('bullqueue.port')
        }
      })
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: configService.get<string>('bullqueue.host'),
        port: configService.get<number>('bullqueue.port')
      })
    }),
    ConfigModule,
    PrismaModule,
    ProductModule,
    CategoryModule
  ],
  providers: [JwtService]
})
export class ProductMainModule {}
