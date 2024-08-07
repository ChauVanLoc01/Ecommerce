export enum OrderFlowEnum {
    WAITING_CONFIRM = 'WAITING_CONFIRM',
    CLIENT_CANCEL = 'CLIENT_CANCEL',
    REQUEST_CANCEL = 'REQUEST_CANCEL',
    ACCEPT_CANCEL = 'ACCEPT_CANCEL',
    CONFIRM_AND_SHIPPING = 'CONFIRM_AND_SHIPPING',
    SHIPING_SUCCESS = 'SHIPING_SUCCESS',
    REQUEST_REFUND = 'REQUEST_REFUND',
    UPDATE_REFUND = 'UPDATE_REFUND',
    CANCEL_REFUND = 'CANCEL_REFUND',
    ACCEPT_REFUND_AND_SHIPPING = 'ACCEPT_REFUND_AND_SHIPPING',
    REFUND_SHIPPING_SUCCESS = 'REFUND_SHIPPING_SUCCESS',
    RE_OPEN_REFUND = 'RE_OPEN_REFUND',
    CLOSE_REFUND = 'CLOSE_REFUND',
    FINISH = 'FINISH',
    REJECT_CANCEL = 'REJECT_CANCEL'
}

export const NormalStatus = {
    [OrderFlowEnum.CLIENT_CANCEL]: true,
    [OrderFlowEnum.REQUEST_CANCEL]: true,
    [OrderFlowEnum.ACCEPT_CANCEL]: true,
    [OrderFlowEnum.REJECT_CANCEL]: true,
    [OrderFlowEnum.CONFIRM_AND_SHIPPING]: true,
    [OrderFlowEnum.SHIPING_SUCCESS]: true,
    [OrderFlowEnum.FINISH]: true
}

export const RefundStatus = {
    [OrderFlowEnum.CANCEL_REFUND]: true,
    [OrderFlowEnum.ACCEPT_REFUND_AND_SHIPPING]: true,
    [OrderFlowEnum.REFUND_SHIPPING_SUCCESS]: true,
    [OrderFlowEnum.CLOSE_REFUND]: true
}
