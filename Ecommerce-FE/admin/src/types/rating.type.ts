import { Pagination } from './pagination.type'
import { Return } from './return.type'

export type Rating = {
    productId: string
    storeId: string
    title: string
    stars: number
    detail: string
    isReply: boolean
    createdBy: string
    createdAt: Date
    updatedAt?: Date
}

export type RatingMaterial = {
    id: string
    url: string
    isPrimary: boolean
    ratingId?: string
    ratingReplyId?: string
}

export type RatingReply = {
    id: string
    ratingId: string
    detail: string
    createdAt: Date
    updatedAt?: Date
    updatedBy?: string
}

export type RatingQuery = {
    createdAt?: string
    reply?: boolean
    startDate?: string
    endDate?: string
} & Pagination

export type RatingListResponse = Return<{
    data: Rating[]
    query: Omit<RatingQuery, 'page'> & { page: number; page_size: number }
}>
