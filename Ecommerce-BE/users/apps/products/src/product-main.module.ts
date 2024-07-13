import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ScheduleModule } from '@nestjs/schedule'
import * as redisStore from 'cache-manager-redis-store'
import { CategoryModule } from './category/category.module'
import { ProductModule } from './product/product.module'
import { SearchModule } from './search/search.module'

@Module({
    imports: [
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
        BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get<string>('bullqueue.host'),
                    port: configService.get<number>('bullqueue.port')
                }
            })
        }),
        ScheduleModule.forRoot(),
        ConfigModule,
        PrismaModule,
        ProductModule,
        CategoryModule,
        SearchModule
    ],
    providers: [JwtService]
})
export class ProductMainModule {}
