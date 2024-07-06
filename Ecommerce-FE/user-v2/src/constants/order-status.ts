export const OrderStatus: { [key: string]: string[] } = {
    WAITING_CONFIRM: ['Chờ xác nhận', 'yellow'],
    SHIPING: ['Đang vận chuyển', 'orange'],
    SUCCESS: ['Thành công', 'blue'],
    CANCEL: ['Đã hủy', 'red']
}

export enum OrderFlowEnum {
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

export const OrderFlowLable = {
    WAITING_CONFIRM: 'Đơn hàng chờ xác nhận',
    SHIPING: 'Đơn hàng đang trong quá trình giao đến bạn',
    SUCCESS: 'Đơn hàng đã giao đến bạn',
    CANCEL: 'Đơn hàng đã bị hủy',
    FINISH: 'Đơn hàng hoàn thành',
    REQUEST_REFUND: 'Bạn đã yêu cầu hoàn đổi sản phẩm',
    UPDATE_REFUND: 'Bạn đã cập nhật đơn hoàn đổi sản phẩm',
    ACCEPT_REFUND: 'Nhà bán hàng đã chấp nhận hoàn đổi sản phẩm',
    IN_PROCESS_REFUND: 'Người bán hàng đang hoàn đổi sản phẩm',
    REFUND_SHIPPING: 'Sản phẩm hoàn đổi đang được vận chuyển đến bạn',
    RE_OPEN_REFUND: 'Sản phẩm hoàn đổi không đạt yêu cầu. Yêu cầu hoàn đổi lại',
    CLOSE_REFUND: 'Sản phẩm hoàn đổi đạt yêu cầu'
}
