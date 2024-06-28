import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import { join_room, leave_room, room_obj } from 'common/constants/socket.constant'
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

    hash(type: string, id: string) {
        return `${type}::${id}`
    }

    @SubscribeMessage(join_room)
    joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: { type: string; id: string }) {
        const { id, type } = body
        let hash = this.hash(type, id)
        socket.join(hash)
        socket.emit(join_room, true)
    }

    @SubscribeMessage(leave_room)
    leaveRoom(
        @ConnectedSocket() socket: Socket,
        @MessageBody() body: { type: string; id: string }
    ) {
        const { id, type } = body
        let hash = this.hash(type, id)
        socket.emit(leave_room, false)
        socket.leave(hash)
    }

    checkStatusOfOrder(id: string, msg: string, action: boolean, result: string[] | null) {
        let hash = this.hash(room_obj.order, id)
        this.server.to(hash).emit(room_obj.order, { msg, action, result })
    }

    updateProductSalePromotion(saleId: string, productId: string, quantity: number) {
        let hash = this.hash(room_obj.sale_promotion, saleId)
        this.server.to(hash).emit(room_obj.sale_promotion, {
            msg: 'Cập nhật số lượng',
            action: true,
            result: { saleId, productId, quantity }
        })
    }

    updateProduct(productId: string, storeId: string, quantity: number, priceAfter: number) {
        const hash = this.hash(room_obj.product, productId)
        this.server.to(hash).emit(room_obj.product, {
            msg: 'Cập nhật số lượng',
            action: true,
            result: {
                storeId,
                productId,
                quantity,
                priceAfter
            }
        })
    }

    updateQuantityVoucher(voucherId: string, storeId: string, quantity: number) {
        const hash = this.hash(room_obj.voucher, voucherId)
        this.server.to(hash).emit(room_obj.voucher, {
            msg: 'Cập nhật số lượng',
            action: true,
            result: {
                storeId,
                voucherId,
                quantity
            }
        })
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        socket.emit('connection', { msg: 'Kết nối thành công', action: true, result: null })
    }

    handleDisconnect(client: Socket) {
        const rooms = Object.keys(client.rooms)
        rooms.forEach((room) => client.leave(room))
    }
}
