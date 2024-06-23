import { Module } from '@nestjs/common'
import { SocketController } from './socket.controller'
import { ConfigModule } from '@app/common'
import { OrderSocketService } from './services/order-socket.service'
import { ProductSocketService } from './services/product-socket.service'
import { VoucherSocketService } from './services/voucher-socket.service'
import { SocketGateway } from './services/socket.gateway'

@Module({
    imports: [ConfigModule],
    controllers: [SocketController],
    providers: [OrderSocketService, ProductSocketService, VoucherSocketService, SocketGateway]
})
export class SocketModule {}
