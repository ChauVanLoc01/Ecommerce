import { ConfigModule } from '@app/common'
import { Module } from '@nestjs/common'
import { SocketController } from './socket.controller'
import { SocketGateway } from './socket.gateway'

@Module({
    imports: [ConfigModule],
    controllers: [SocketController],
    providers: [SocketGateway]
})
export class SocketModule {}
