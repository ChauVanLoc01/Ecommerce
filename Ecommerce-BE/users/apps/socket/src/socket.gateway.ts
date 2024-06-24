import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor() {}

    @SubscribeMessage('order')
    handleEvent(@ConnectedSocket() socket: Socket, @MessageBody() id: string) {
        let hash = `order::${id}`
        socket.join(hash)
        this.server.to(hash).emit('order', 'Theo dõi trạng thái đơn hàng')
    }

    checkStatusOfOrder(id: string, msg: string, action: boolean, result: string[] | null) {
        let hash = `order::${id}`
        this.server.to(hash).emit('order', { msg, action, result })
        this.server.socketsLeave(hash)
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        socket.emit('connection', { msg: 'Kết nối thành công', action: true, result: null })
    }

    handleDisconnect(client: Socket) {
        const rooms = Object.keys(client.rooms)
        rooms.forEach((room) => client.leave(room))
    }
}
