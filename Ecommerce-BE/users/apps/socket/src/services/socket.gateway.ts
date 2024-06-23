import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import { Server } from 'http'

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server

    @SubscribeMessage('events')
    handleEvent(@MessageBody() data: string) {
        this.server.emit('events', data)
    }

    handleConnection(client: any, ...args: any[]) {
        console.log('User connected')
    }

    handleDisconnect(client: any) {
        console.log('User disconnected')
    }

    afterInit(server: Server) {
        console.log('Kết nối đến socket thành công', server)
    }
}
