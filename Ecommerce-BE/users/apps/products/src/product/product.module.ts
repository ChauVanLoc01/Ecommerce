import { Module } from '@nestjs/common'
import { ConfigModule } from '@app/common'

import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'

@Module({
  imports: [
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
              queue: configService.get<string>('rabbitmq.user_queue'),
              queueOptions: {
                durable: true
              }
            }
          }),
          inject: [ConfigService]
        }
      ]
    }),
    ConfigModule
  ],

  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
