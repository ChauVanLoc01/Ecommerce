import { ConfigModule } from '@app/common'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import * as redisStore from 'cache-manager-redis-store'
import { SocketController } from './socket.controller'
import { SocketGateway } from './socket.gateway'

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
        ConfigModule,
        ScheduleModule.forRoot()
    ],
    controllers: [SocketController],
    providers: [SocketGateway]
})
export class SocketModule {}
