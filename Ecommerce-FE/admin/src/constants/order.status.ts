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
    }
}

export enum OrderStatusWithoutColor {
    WAITING_CONFIRM = 'WAITING_CONFIRM',
    SHIPING = 'SHIPING',
    SUCCESS = 'SUCCESS',
    CANCEL = 'CANCEL'
}
