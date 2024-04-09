import { ConfigModule } from '@app/common'
import { Module } from '@nestjs/common'
import { StoreModule } from './Store/store.module'
import { ProductManagementModule } from './ProductManagement/pro_mana.module'
import { UserManagementModule } from './UserManagement/user_mana.module'
import { VoucherManagementModule } from './VoucherManagement/voucher_mana.module'
import { JwtService } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { QueueName } from 'common/constants/queue.constant'

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
    ConfigModule,
    StoreModule,
    ProductManagementModule,
    UserManagementModule,
    VoucherManagementModule
  ],
  controllers: [],
  providers: []
})
export class StoreMainModule {}
