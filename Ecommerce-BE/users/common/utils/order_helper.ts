import { ClientProxy } from '@nestjs/microservices'
import {
    commit_order_success,
    commitUpdateQuantityProducts,
    emit_update_product_whenCreatingOrder,
    emit_update_voucher_whenCreatingOrder,
    rollbackOrder,
    rollbackUpdateQuantityProducts,
    statusOfOrder,
    update_Product_WhenCreatingOrder,
    update_voucher_whenCreatingOrder
} from 'common/constants/event.constant'
import { room_obj } from 'common/constants/socket.constant'
import {
    NextStepToOrderingPayload,
    OrderStatusPayload,
    Update_Product_WhenCreatingOrderPayload,
    Update_Voucher_WhenCreatingOrderPayload
} from 'common/types/order_payload.type'

export const hash = (type: keyof typeof room_obj, id: string) => `${type}::${id}`

export const emit_update_Order_WhenCreatingOrder_fn = (
    client: ClientProxy,
    payload: OrderStatusPayload
) => {
    client.emit(statusOfOrder, payload)
}

export const emit_update_Product_WhenCreatingOrderPayload_fn = (
    client: ClientProxy,
    payload: Update_Product_WhenCreatingOrderPayload
) => {
    client.emit(emit_update_product_whenCreatingOrder, payload)
}

export const emit_update_Voucher_WhenCreatingOrderPayload = (
    client: ClientProxy,
    payload: Update_Voucher_WhenCreatingOrderPayload
) => {
    client.emit(emit_update_voucher_whenCreatingOrder, payload)
}

// Next step update product and voucher

export const next_update_product = (client: ClientProxy, payload: NextStepToOrderingPayload) => {
    client.emit(update_Product_WhenCreatingOrder, payload)
}

export const next_update_voucher = (client: ClientProxy, payload: NextStepToOrderingPayload) => {
    client.emit(update_voucher_whenCreatingOrder, payload)
}

// Commit khi tất cả các step đều thành công

export const commit_order_creating_order_success = (
    client: ClientProxy,
    payload: NextStepToOrderingPayload
) => {
    client.emit(commit_order_success, payload)
}

export const emit_roll_back_order = (client: ClientProxy, payload: NextStepToOrderingPayload) => {
    client.emit(rollbackOrder, payload)
}

export const commit_product_creating_order_success = (
    client: ClientProxy,
    payload: NextStepToOrderingPayload
) => {
    client.emit(commitUpdateQuantityProducts, payload)
}

export const emit_roll_back_product = (client: ClientProxy, payload: NextStepToOrderingPayload) => {
    client.emit(rollbackUpdateQuantityProducts, payload)
}
