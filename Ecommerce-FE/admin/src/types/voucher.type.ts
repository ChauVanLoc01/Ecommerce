import { Return } from './return.type'

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
    createdAt: string
    updatedBy?: string
    updatedAt?: string
    categoryConditionId: string
    priceConditionId: string
}

export type VoucherQuery = {
    startDate?: string
    endDate?: string
    status?: string
    code?: string
    createdAt?: string
    page?: number
    limit?: number
}

export type VoucherListReponse = Return<{
    data: Voucher[]
    query: Omit<VoucherQuery, 'page'> & { page: number; page_size: number }
}>

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

export type CategoryConditionVoucher = {
    id: string
    categoryShortName: string
    createdAt: string
    createdBy: string
    updatedAt?: string
    updatedBy?: string
}

export type VoucherDetailReponse = Return<
    Voucher & {
        CategoryConditionVoucher: CategoryConditionVoucher
        PriceConditionVoucher: PriceConditionVoucher
    }
>
