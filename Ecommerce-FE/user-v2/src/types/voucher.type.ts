import { Return } from './return.type'

export type CategoryConditionVoucher = {
    id: string
    categoryShortName: string
    createdAt: string
    createdBy: string
    updatedAt?: string
    updatedBy?: string
}

export type PriceConditionVoucher = {
    id: string
    totalMin?: number
    totalMax?: number
    priceMin?: number
    priceMax?: number
    createdAt: string
    createdBy: string
    updatedAt?: string
    updatedBy?: string
}

export type Voucher = {
    id: string
    code: string
    title: string
    description: string
    initQuantity: number
    currentQuantity: number
    status: string
    type: string
    storeId: string
    percent: number
    maximum: number
    startDate: Date
    endDate: Date
    createdBy: string
    createdAt: Date
    updatedBy?: string
    updatedAt?: string
    categoryConditionId?: string
    priceConditionId?: string
}

export type VoucherWithCondition = Voucher & {
    CategoryConditionVoucher?: CategoryConditionVoucher
    PriceConditionVoucher?: PriceConditionVoucher
}

export type VoucherStoreResponse = Return<VoucherWithCondition[]>

export type SearchVoucher = {
    code: string
    storesID: string[]
}
