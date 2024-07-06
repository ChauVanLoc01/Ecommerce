export const OrderStatus: { [key: string]: { lable: string; color: string } } = {
    WAITING_CONFIRM: {
        lable: 'Chờ xác nhận',
        color: 'yellow'
    },
    SHIPING: {
        lable: 'Đang vận chuyển',
        color: 'orange'
    },
    SUCCESS: {
        lable: 'Thành công',
        color: 'green'
    },
    CANCEL: {
        lable: 'Đã hủy',
        color: 'red'
    }
}

export const UserStatus: { [key: string]: { lable: string; color: string } } = {
    ACTIVE: {
        lable: 'Đang hoạt động',
        color: 'blue'
    },
    BLOCK: {
        lable: 'Đã bị khóa',
        color: 'red'
    },
    HIDDEN: {
        lable: 'Đã ẩn',
        color: 'orange'
    }
}

export enum OrderStatusWithoutColor {
    WAITING_CONFIRM = 'WAITING_CONFIRM',
    SHIPING = 'SHIPING',
    SUCCESS = 'SUCCESS',
    CANCEL = 'CANCEL'
}

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
    FINISH = 'FINISH'
}

export const order_next_flow = {
    [OrderFlowEnum.WAITING_CONFIRM]: [OrderFlowEnum.REQUEST_CANCEL, OrderFlowEnum.CONFIRM_AND_SHIPPING],
    [OrderFlowEnum.CONFIRM_AND_SHIPPING]: [OrderFlowEnum.SHIPING_SUCCESS],
    [OrderFlowEnum.REQUEST_REFUND]: [OrderFlowEnum.ACCEPT_REFUND_AND_SHIPPING, OrderFlowEnum.CANCEL_REFUND],
    [OrderFlowEnum.ACCEPT_REFUND_AND_SHIPPING]: [OrderFlowEnum.REFUND_SHIPPING_SUCCESS]
}

export const OrderFlowLable = {
    [OrderFlowEnum.WAITING_CONFIRM]: 'Đơn hàng chờ xác nhận',
    [OrderFlowEnum.CLIENT_CANCEL]: 'Khách hàng đã hủy đơn',
    [OrderFlowEnum.REQUEST_CANCEL]: 'Yêu cầu hủy đơn hàng với khách hàng',
    [OrderFlowEnum.ACCEPT_CANCEL]: 'Khách hàng xác nhận cho phép cửa hàng hủy đơn',
    [OrderFlowEnum.CONFIRM_AND_SHIPPING]: 'Đơn hàng đang trong quá trình giao đến khách hàng',
    [OrderFlowEnum.SHIPING_SUCCESS]: 'Đơn hàng đã giao đến khách hàng',
    [OrderFlowEnum.REQUEST_REFUND]: 'Khách hàng đã yêu cầu hoàn đổi sản phẩm',
    [OrderFlowEnum.UPDATE_REFUND]: 'Khách hàng đã cập nhật đơn hoàn đổi sản phẩm',
    [OrderFlowEnum.ACCEPT_REFUND_AND_SHIPPING]:
        'Cửa hàng của bạn đã chấp nhận hoàn đổi sản phẩm và đang tiến hành gửi sản phẩm khác đến khách hàng',
    [OrderFlowEnum.REFUND_SHIPPING_SUCCESS]: 'Đơn hoàn đổi sản phẩm đã giao đến khách hàng',
    [OrderFlowEnum.RE_OPEN_REFUND]: 'Sản phẩm hoàn đổi không đạt yêu cầu. Khách hàng yêu cầu hoàn đổi lại',
    [OrderFlowEnum.CLOSE_REFUND]: 'Sản phẩm hoàn đổi đạt yêu cầu. Đơn hoàn đổi đóng',
    [OrderFlowEnum.FINISH]: 'Đơn hàng hoàn thành'
}
