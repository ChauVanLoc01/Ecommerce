import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { ConfigModule } from '@app/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
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
  controllers: [ProductsController, ProductController],
  providers: [ProductsService]
})
export class ProductsModule {}
