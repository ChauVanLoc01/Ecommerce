export enum OrderStatus {
    WAITING_CONFIRM = 'WAITING_CONFIRM',
    SHIPING = 'SHIPING',
    SUCCESS = 'SUCCESS',
    CANCEL = 'CANCEL',
    FINISH = 'FINISH',
    IN_PROCESS_REFUND = 'IN_PROCESS_REFUND',
    REQUEST_REFUND = 'REQUEST_REFUND',
    UPDATE_REFUND = 'UPDATE_REFUND',
    ACCEPT_REFUND = 'ACCEPT_REFUND',
    REFUND_SHIPPING = 'REFUND_SHIPPING',
    RE_OPEN_REFUND = 'RE_OPEN_REFUND',
    CLOSE_REFUND = 'CLOSE_REFUND'
}

export enum RefundStatus {
    IN_PROCESS = 'IN_PROCESS',
    ACCEPT = 'ACCEPT',
    FINISH = 'FINISH'
}

export enum OrderShipping {
    SHIPPING = 'SHIPPING',
    REFUND = 'REFUND'
}
