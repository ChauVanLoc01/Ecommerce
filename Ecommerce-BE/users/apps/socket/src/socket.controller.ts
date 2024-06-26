import { Controller, Get } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import { statusOfOrder, updateQuantityProduct } from 'common/constants/event.constant'
import { SocketGateway } from './socket.gateway'

@Controller()
export class SocketController {
    constructor(private readonly socketGateway: SocketGateway) {}

    @Get()
    healthyCheck() {
        return 'Socket service is still working'
    }

    @EventPattern(statusOfOrder)
    done(payload: { id: string; msg: string; action: boolean; result: string[] | null }) {
        let { action, id, result, msg } = payload
        this.socketGateway.checkStatusOfOrder(id, msg, action, result)
    }

    @EventPattern(updateQuantityProduct)
    updateQuantityProduct(payload: { type: string; id: string; quantity: number }) {
        let { id, quantity, type } = payload
        this.socketGateway.updateQuantity(type, id, quantity)
    }
}
