import { ConfigModule } from '@app/common'
import { PrismaService } from '@app/common/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { QueueName } from 'common/constants/queue.constant'
import { PaymentController } from './payment.controller'
import { PaymentService } from './payment.service'

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
        })
    ],
    controllers: [PaymentController],
    providers: [PaymentService, PrismaService]
})
export class PaymentModule {}
