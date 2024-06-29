import { Controller, Get } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import {
    statusOfOrder,
    updateQuantityProduct,
    updateQuantityProductSalePromotion,
    updateQuantityVoucher
} from 'common/constants/event.constant'
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

    @EventPattern(updateQuantityVoucher)
    updateQuantityVoucher(payload: { voucherId: string; storeId: string; quantity: number }) {
        let { quantity, voucherId, storeId } = payload
        this.socketGateway.updateQuantityVoucher(voucherId, storeId, quantity)
    }

    @EventPattern(updateQuantityProduct)
    updateProduct(payload: {
        productId: string
        storeId: string
        quantity: number
        priceAfter: number
    }) {
        let { quantity, productId, storeId, priceAfter } = payload
        this.socketGateway.updateProduct(productId, storeId, quantity, priceAfter)
    }

    @EventPattern(updateQuantityProductSalePromotion)
    updateQuantityProductSalePromotion(payload: {
        saleId: string
        productId: string
        quantity: number
    }) {
        let { productId, quantity, saleId } = payload
        this.socketGateway.updateProductSalePromotion(saleId, productId, quantity)
    }
}
