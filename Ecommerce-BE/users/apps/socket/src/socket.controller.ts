import { Controller, Get } from '@nestjs/common'
import { EventPattern } from '@nestjs/microservices'
import {
    emit_update_product_whenCreatingOrder,
    emit_update_voucher_whenCreatingOrder,
    statusOfOrder,
    updateQuantityProductSalePromotion
} from 'common/constants/event.constant'
import {
    OrderStatusPayload,
    Update_Product_WhenCreatingOrderPayload,
    Update_Voucher_WhenCreatingOrderPayload
} from 'common/types/order_payload.type'
import { SocketGateway } from './socket.gateway'

@Controller()
export class SocketController {
    constructor(private readonly socketGateway: SocketGateway) {}

    @Get()
    healthyCheck() {
        return 'Socket service is still working'
    }

    @EventPattern(statusOfOrder)
    statusOfOrder(payload: OrderStatusPayload) {
        let { action, id, result, msg } = payload
        this.socketGateway.checkStatusOfOrder(id, msg, action, result)
    }

    @EventPattern(emit_update_voucher_whenCreatingOrder)
    updateQuantityVoucher(payload: Update_Voucher_WhenCreatingOrderPayload) {
        let { quantity, voucherId, storeId } = payload
        console.log('socket update quantity voucher')
        this.socketGateway.updateQuantityVoucher(voucherId, storeId, quantity)
    }

    @EventPattern(emit_update_product_whenCreatingOrder)
    updateProduct(payload: Update_Product_WhenCreatingOrderPayload) {
        let { quantity, productId, storeId, priceAfter, isSale, currentSaleId } = payload
        this.socketGateway.updateProduct(
            productId,
            storeId,
            quantity,
            priceAfter,
            isSale,
            currentSaleId
        )
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
