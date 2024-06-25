import { ConfigModule, PrismaModule } from '@app/common'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MulterModule } from '@nestjs/platform-express'
import { BackgroundName } from 'common/constants/background-job.constant'
import { QueueName } from 'common/constants/queue.constant'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
    imports: [
        ScheduleModule.forRoot(),
        BullModule.registerQueue({
            name: BackgroundName.product
        }),
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
        MulterModule.register({
            storage: diskStorage({
                destination(req, file, callback) {
                    callback(null, process.cwd() + '/public/images')
                },
                filename(req, file, callback) {
                    callback(null, `${new Date().toISOString()}-${uuidv4()}-${file.originalname}`)
                }
            })
        }),
        ConfigModule,
        PrismaModule
    ],

    controllers: [ProductController],
    providers: [ProductService, JwtService]
})
export class ProductModule {}
