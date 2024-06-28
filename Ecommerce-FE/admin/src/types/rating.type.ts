import { Pagination } from './pagination.type'
import { Return } from './return.type'

export type RatingTableType = {

    productId: string
    storeId: string
    userName: string
    stars: number
    comment: string
    isReply: boolean
    createdBy: string
    createdAt: Date
    updatedAt?: Date
}


export type RatingFromUser = {
    userId: string
    username: string
    ratingId: string
    email: string
    stars: number
    comment: string
    replyCreatedTime: Date

}


export type RatingMaterial = {
    id: string
    url: string
    isPrimary: boolean
    ratingId?: string
    ratingReplyId?: string
}

export type RatingReplyBody = {
    parentRatingId: string
    comment: string
    urls: string[]
}

export type RatingQuery = {
    createdAt?: string
    reply?: boolean
    startDate?: string
    endDate?: string
} & Pagination

export type RatingTableResponse = Return<{
    data: RatingTableType[]
    query: Omit<RatingQuery, 'page'> & { page: number; page_size: number }
}>
