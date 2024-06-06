import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { JwtService } from '@nestjs/jwt'
import * as redisStore from 'cache-manager-redis-store'
import { CategoryModule } from './category/category.module'
import { ProductModule } from './product/product.module'
import { SearchModule } from './search/search.module'

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
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get<string>('elasticsearch.node'),
        auth: {
          username: configService.get('elasticsearch.username'),
          password: configService.get('elasticsearch.password')
        }
      }),
      inject: [ConfigService]
    }),
    PrismaModule,
    ProductModule,
    CategoryModule,
    SearchModule
  ],
  providers: [JwtService]
})
export class ProductMainModule {}
