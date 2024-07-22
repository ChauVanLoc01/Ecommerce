import { OBJECT } from './role'

export type VoucherType = 'STORE' | 'GLOBAL'

export const voucher_type: Record<OBJECT, VoucherType> = {
    ADMIN: 'GLOBAL',
    STORE_OWNER: 'STORE',
    EMPLOYEE: 'STORE'
}
