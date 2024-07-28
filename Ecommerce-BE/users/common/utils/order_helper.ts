import { ClientProxy } from '@nestjs/microservices'
import {
    commit_order,
    emit_update_product_whenCreatingOrder,
    emit_update_voucher_whenCreatingOrder,
    roll_back_order,
    statusOfOrder,
    update_Product_WhenCreatingOrder,
    update_voucher_whenCreatingOrder
} from 'common/constants/event.constant'
import { room_obj } from 'common/constants/socket.constant'
import {
    CreateOrderPayload,
    OrderStatusPayload,
    Update_Product_WhenCreatingOrderPayload,
    Update_Voucher_WhenCreatingOrderPayload
} from 'common/types/order_payload.type'

export const hash = (type: keyof typeof room_obj, id: string) => `${type}::${id}`

export const emit_update_status_of_order = (client: ClientProxy, payload: OrderStatusPayload) => {
    console.log('emit status to order')
    client.emit(statusOfOrder, payload)
}

export const emit_update_quantity_of_product = (
    client: ClientProxy,
    payload: Update_Product_WhenCreatingOrderPayload
) => {
    client.emit(emit_update_product_whenCreatingOrder, payload)
}

export const emit_update_quantity_of_voucher = (
    client: ClientProxy,
    payload: Update_Voucher_WhenCreatingOrderPayload
) => {
    client.emit(emit_update_voucher_whenCreatingOrder, payload)
}

// Next step update product and voucher

export const product_next_step = (
    client: ClientProxy,
    payload: CreateOrderPayload<'update_product'>
) => {
    client.emit(update_Product_WhenCreatingOrder, payload)
}

export const voucher_next_step = (
    client: ClientProxy,
    payload: CreateOrderPayload<'update_voucher'>
) => {
    client.emit(update_voucher_whenCreatingOrder, payload)
}

// Commit khi tất cả các step đều thành công

export const commit_create_order_success = (
    clients: ClientProxy[],
    payload: CreateOrderPayload<'commit_success'>
) => {
    clients.forEach((client) => client.emit(commit_order, payload))
}

export const emit_roll_back_order = (
    clients: ClientProxy[],
    payload: CreateOrderPayload<'roll_back_order'>
) => {
    console.log('emit rollback từ order helper')
    clients.forEach((client) => client.emit(roll_back_order, payload))
}
