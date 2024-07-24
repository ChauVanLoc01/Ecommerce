import { Status } from './product.status'
import { OBJECT } from './role'

export type VoucherType = 'STORE' | 'GLOBAL'

export const voucher_type: Record<OBJECT, VoucherType> = {
    ADMIN: 'GLOBAL',
    STORE_OWNER: 'STORE',
    EMPLOYEE: 'STORE'
}

export const voucher_label = {
    [Status.block]: 'Ẩn',
    [Status.active]: 'Cho phép sử dụng',
    [Status.hidden]: 'Private voucher'
}
