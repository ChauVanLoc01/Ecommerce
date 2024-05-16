import { ConfigModule } from '@app/common'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { QueueName } from 'common/constants/queue.constant'
import { StoreModule } from './Store/store.module'
import { VoucherModule } from './Voucher/voucher.module'

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
    ConfigModule,
    StoreModule,
    VoucherModule
  ],
  controllers: [],
  providers: []
})
export class StoreMainModule {}
