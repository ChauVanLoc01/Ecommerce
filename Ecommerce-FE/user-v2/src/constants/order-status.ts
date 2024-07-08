export const OrderStatus: { [key: string]: { label: string; color: string } } = {
    WAITING_CONFIRM: {
        label: 'Chờ xác nhận',
        color: 'orange'
    },
    CLIENT_CANCEL: {
        label: 'Khách hàng hủy',
        color: 'red'
    },
    REQUEST_CANCEL: {
        label: 'Yêu cầu hủy đơn với khách hàng',
        color: 'red'
    },
    ACCEPT_CANCEL: {
        label: 'Khách hàng đồng ý hủy đơn',
        color: 'red'
    },
    CONFIRM_AND_SHIPPING: {
        label: 'Xác nhận và đang giao hàng',
        color: 'yellow'
    },
    SHIPING_SUCCESS: {
        label: 'Giao hàng thành công',
        color: 'green'
    },
    REQUEST_REFUND: {
        label: 'Yêu cầu hoàn đổi',
        color: 'blue'
    },
    UPDATE_REFUND: {
        label: 'Cập nhật hoàn đổi',
        color: 'blue'
    },
    CANCEL_REFUND: {
        label: 'Hủy hoàn đổi',
        color: 'blue'
    },
    ACCEPT_REFUND_AND_SHIPPING: {
        label: 'Đồng ý hoàn đổi và đang giao hàng',
        color: 'purple'
    },
    REFUND_SHIPPING_SUCCESS: {
        label: 'Giao đơn hoàn đổi thành công',
        color: 'purple'
    },
    RE_OPEN_REFUND: {
        label: 'Mở lại yêu cầu hoàn đổi',
        color: 'blue'
    },
    CLOSE_REFUND: {
        label: 'Đóng yêu cầu hoàn đổi',
        color: 'blue'
    },
    FINISH: {
        label: 'Hoàn thành',
        color: 'green'
    }
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
    [OrderFlowEnum.WAITING_CONFIRM]: [OrderFlowEnum.CLIENT_CANCEL],
    [OrderFlowEnum.SHIPING_SUCCESS]: [OrderFlowEnum.REQUEST_REFUND, OrderFlowEnum.FINISH],
    [OrderFlowEnum.REQUEST_REFUND]: [OrderFlowEnum.UPDATE_REFUND, OrderFlowEnum.CANCEL_REFUND],
    [OrderFlowEnum.UPDATE_REFUND]: [OrderFlowEnum.CANCEL_REFUND],
    [OrderFlowEnum.CANCEL_REFUND]: [OrderFlowEnum.REQUEST_REFUND, OrderFlowEnum.FINISH],
    [OrderFlowEnum.REFUND_SHIPPING_SUCCESS]: [OrderFlowEnum.RE_OPEN_REFUND, OrderFlowEnum.CLOSE_REFUND]
}

export const OrderFlowLabel = {
    WAITING_CONFIRM: 'Đơn hàng chờ xác nhận',
    CLIENT_CANCEL: 'Bạn đã hủy đơn hàng',
    REQUEST_CANCEL: 'Yêu cầu hủy',
    ACCEPT_CANCEL: 'Đồng ý hủy',
    CONFIRM_AND_SHIPPING: 'Cửa hàng đã xác nhận và đang giao hàng',
    SHIPING_SUCCESS: 'Giao hàng thành công',
    REQUEST_REFUND: 'Bạn đã yêu cầu hoàn đổi sản phẩm',
    CANCEL_REFUND: 'Bạn đã hủy đơn hoàn đổi',
    UPDATE_REFUND: 'Bạn đã cập nhật đơn hoàn đổi?',
    ACCEPT_REFUND_AND_SHIPPING: 'Cửa hàng đồng ý hoàn đổi sản phẩm và đang giao hàng',
    REFUND_SHIPPING_SUCCESS: 'Giao đơn hoàn đổi thành công',
    RE_OPEN_REFUND: 'Bạn đã yêu cầu hoàn đổi tiếp tục',
    CLOSE_REFUND: 'Bạn đã đóng yêu cầu hoàn đổi sản phẩm',
    FINISH: 'Bạn đã xác nhận hoàn thành đơn hàng?'
}

export const OrderNextFlowLabel = {
    WAITING_CONFIRM: 'Đơn hàng chờ xác nhận',
    CLIENT_CANCEL: 'Bạn muốn hủy đơn hàng',
    REQUEST_CANCEL: 'Yêu cầu hủy',
    ACCEPT_CANCEL: 'Đồng ý hủy',
    CONFIRM_AND_SHIPPING: 'Đã xác nhận và đang giao hàng',
    SHIPING_SUCCESS: 'Giao hàng thành công',
    REQUEST_REFUND: 'Yêu cầu hoàn đổi sản phẩm',
    CANCEL_REFUND: 'Bạn muốn hủy đơn hoàn đổi?',
    UPDATE_REFUND: 'Bạn muốn cập nhật đơn hoàn đổi?',
    ACCEPT_REFUND_AND_SHIPPING: 'Cửa hàng đồng ý hoàn đổi sản phẩm và đang giao hàng',
    REFUND_SHIPPING_SUCCESS: 'Giao đơn hoàn đổi thành công',
    RE_OPEN_REFUND: 'Mở lại yêu cầu hoàn đổi sản phẩm',
    CLOSE_REFUND: 'Đóng yêu cầu hoàn đổi sản phẩm',
    FINISH: 'Xác nhận hoàn thành đơn hàng?'
}
