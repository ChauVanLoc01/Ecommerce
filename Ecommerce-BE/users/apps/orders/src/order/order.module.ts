import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { BackgroundName } from 'common/constants/background-job.constant'
import { QueueName } from 'common/constants/queue.constant'
import { OrderConsummer } from '../workers/order.worker'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
    imports: [
        ClientsModule.registerAsync({
            isGlobal: true,
            clients: [
                {
                    name: 'SOCKET_SERVICE',
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.RMQ,
                        options: {
                            urls: [configService.get<string>('rabbitmq.uri')],
                            queue: QueueName.socket,
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
                    name: 'ORDER_SERVICE',
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.RMQ,
                        options: {
                            urls: [configService.get<string>('rabbitmq.uri')],
                            queue: QueueName.order,
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
        ClientsModule.registerAsync({
            isGlobal: true,
            clients: [
                {
                    name: 'STORE_SERVICE',
                    imports: [ConfigModule],
                    useFactory: (configService: ConfigService) => ({
                        transport: Transport.RMQ,
                        options: {
                            urls: [configService.get<string>('rabbitmq.uri')],
                            queue: QueueName.store,
                            queueOptions: {
                                durable: true
                            }
                        }
                    }),
                    inject: [ConfigService]
                }
            ]
        }),
        BullModule.registerQueue({
            name: BackgroundName.order
        }),
        PrismaModule,
        JwtModule
    ],
    controllers: [OrderController],
    providers: [OrderService, OrderConsummer]
})
export class OrderModule {}
