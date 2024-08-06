import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject } from '@nestjs/common'
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import { Cache } from 'cache-manager'
import { currentSalePromotion } from 'common/constants/event.constant'
import {
    current_sale_promotion,
    join_room,
    leave_room,
    room_obj
} from 'common/constants/socket.constant'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    hash(type: string, id: string) {
        return `${type}::${id}`
    }

    @SubscribeMessage(join_room)
    joinRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: { type: string; id: string }) {
        const { id, type } = body
        let hash = this.hash(type, id)
        console.log(`client đã join vào room [${type}] có id là :::::::::::${hash}:::::::::`)
        socket.join(hash)
        socket.emit(join_room, true)
    }

    @SubscribeMessage(current_sale_promotion)
    async join_sale(@ConnectedSocket() socket: Socket) {
        console.log(`client đã join vào room CURRENT SALE`)
        let cache = await this.cacheManager.get<string>(currentSalePromotion)
        socket.join(current_sale_promotion)
        socket.emit(current_sale_promotion, cache || '')
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
        console.log(
            `::::::::::Socket đã nhận được yêu cầu từ socket controller ==> Socket cập nhật trạng thái [${msg}] tới client với room [${id}] ::::::::::`
        )
        this.server.to(hash).emit(room_obj.order, { msg, action, result })
    }

    statusTransaction(action: boolean, id: string, msg: string) {
        let hash = this.hash(room_obj.transaction, id)
        this.server.to(hash).emit(room_obj.transaction, {
            msg,
            action,
            result: null
        })
    }

    updateProductSalePromotion(saleId: string, productId: string, quantity: number) {
        let hash = this.hash(room_obj.sale_promotion, saleId)
        console.log(
            `::::::Socket cập nhật số lượng product sale tới client ==> [ProductID----${productId}] với số lượng [${quantity}]----SalID: [${saleId}]::::::::`
        )
        this.server.to(hash).emit(room_obj.sale_promotion, {
            msg: 'Cập nhật số lượng',
            action: true,
            result: { saleId, productId, quantity }
        })
    }

    updateProduct(
        productId: string,
        storeId: string,
        quantity: number,
        priceAfter: number,
        currentSaleId?: string,
        status?: string,
        name?: string
    ) {
        const hash = this.hash(room_obj.product, productId)
        let result = {
            storeId,
            productId,
            quantity,
            priceAfter,
            status,
            name
        }
        console.log(
            `::::::Socket cập nhật số lượng PRODUCT tới client ==> [ProductID----${productId}] với số lượng [${quantity}]`
        )
        this.server.to(hash).emit(room_obj.product, {
            msg: 'Cập nhật số lượng',
            action: true,
            result
        })
    }

    updateQuantityVoucher(voucherId: string, storeId: string, quantity: number) {
        const hash = this.hash(room_obj.voucher, voucherId)
        console.log(
            `::::::Socket cập nhật số lượng VOUCHER tới client ==> [ProductID----${voucherId}] với số lượng [${quantity}]`
        )
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

    updateCurrentSalePromotion(current_sale_promotion_id: string) {
        this.server.emit(current_sale_promotion, current_sale_promotion_id)
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        socket.emit('connection', { msg: 'Kết nối thành công', action: true, result: null })
    }

    handleDisconnect(client: Socket) {
        const rooms = Object.keys(client.rooms)
        rooms.forEach((room) => client.leave(room))
    }
}
