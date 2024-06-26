import { ConfigModule } from '@app/common'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import * as redisStore from 'cache-manager-redis-store'
import { QueueName } from 'common/constants/queue.constant'
import { OrderModule } from './order/order.module'
import { PaymentModule } from './payment/payment.module'

@Module({
    imports: [
        CacheModule.register(),
        ClientsModule.registerAsync({
            isGlobal: true,
            clients: [
                {
                    name: 'PRODUCT_SERVICE',
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.RMQ,
                        options: {
                            urls: [configService.get<string>('rabbitmq.uri')],
                            queue: QueueName.product,
                            queueOptions: {
                                durable: true
                            }
                        }
                    }),
                    inject: [ConfigService]
                }
            ]
        }),
        ClientsModule.registerAsync({
            isGlobal: true,
            clients: [
                {
                    name: 'USER_SERVICE',
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.RMQ,
                        options: {
                            urls: [configService.get<string>('rabbitmq.uri')],
                            queue: QueueName.user,
                            queueOptions: {
                                durable: true
                            }
                        }
                    }),
                    inject: [ConfigService]
                }
            ]
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
        OrderModule,
        PaymentModule
    ],
    controllers: [],
    providers: []
})
export class OrderMainModule {}
