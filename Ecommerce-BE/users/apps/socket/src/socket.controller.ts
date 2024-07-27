import { Controller, Get } from '@nestjs/common'
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices'
import {
    emit_update_product_whenCreatingOrder,
    emit_update_voucher_whenCreatingOrder,
    statusOfOrder,
    statusOfTransaction,
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
    statusOfOrder(@Payload() payload: OrderStatusPayload, @Ctx() context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        channel.ack(originalMsg)
        let { action, id, result, msg } = payload
        console.log(
            `:::::::::Socket Controller đã nhận được yêu cầu cập nhật trạng thái đơn hàng [id: ${id}] [msg: ${msg}] [action: ${action}]`
        )
        this.socketGateway.checkStatusOfOrder(id, msg, action, result)
    }

    @EventPattern(statusOfTransaction)
    statusTransaction(payload: { action: boolean; id: string; msg: string }) {
        let { action, id, msg } = payload
        console.log(
            `:::::::::Socket Controller đã nhận được yêu cầu cập nhật trạng thái THANH TOAN [id: ${id}] [msg: ${msg}] [action: ${action}]`
        )
        this.socketGateway.statusTransaction(action, id, msg)
    }

    @EventPattern(emit_update_voucher_whenCreatingOrder)
    updateQuantityVoucher(
        @Payload() payload: Update_Voucher_WhenCreatingOrderPayload,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        channel.ack(originalMsg)
        let { quantity, voucherId, storeId } = payload
        console.log('socket update quantity voucher')
        this.socketGateway.updateQuantityVoucher(voucherId, storeId, quantity)
    }

    @EventPattern(emit_update_product_whenCreatingOrder)
    updateProduct(
        @Payload() payload: Update_Product_WhenCreatingOrderPayload,
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        channel.ack(originalMsg)
        let { quantity, productId, storeId, priceAfter, currentSaleId } = payload
        this.socketGateway.updateProduct(productId, storeId, quantity, priceAfter, currentSaleId)
    }

    @EventPattern(updateQuantityProductSalePromotion)
    updateQuantityProductSalePromotion(
        @Payload()
        payload: {
            saleId: string
            productId: string
            quantity: number
        },
        @Ctx() context: RmqContext
    ) {
        const channel = context.getChannelRef()
        const originalMsg = context.getMessage()
        channel.ack(originalMsg)
        let { productId, quantity, saleId } = payload
        this.socketGateway.updateProductSalePromotion(saleId, productId, quantity)
    }
}
