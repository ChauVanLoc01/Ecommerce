import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, PrismaModule } from '@app/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [CacheModule.registerAsync({
    isGlobal: true,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      isGlobal: true,
      store: redisStore,
      host: configService.get<string>('bullqueue.host'),
      port: configService.get<number>('bullqueue.port'),
    }),
  }), PrismaModule, JwtModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
