import { ProductOrder } from './order.type'
import { Return } from './return.type'

export type Rating = {
    id: string
    storeId: string
    orderId: string
    stars: number
    comment: string
    isReply: boolean
    createdBy: string
    createdAt: Date
    updatedBy: null
    updatedAt: null
}

export type RatingBody = {
    orderId: string
    storeId: string
    stars: number
    comment: string
    urls: UrlObj[]
}

export type UrlObj = {
    url: string
    isPrimary: boolean
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
    page?: number
    limit?: number
}

export type SummaryRating = {
    one: number
    two: number
    three: number
    four: number
    five: number
    total: number
    average: number
}

export type DataRatingListResponse = {
    data: {
        summary: SummaryRating
        ratings: (Rating & { RatingReply: RatingReply[] })[]
    }
    query: { page: number; page_size: number }
}

export type RatingListResponse = Return<DataRatingListResponse>

export type CreateRatingResponse = Return<{
    cratedRating: Rating
    materials: RatingMaterial[]
}>

export type IsCreateRatingResponse = Return<boolean | ProductOrder[]>

export type CreateRatingBody = {
    orderId: string
    storeId: string
    comment: string
    stars: number
    urls: {
        url: string
        isPrimary?: boolean
    }[]
}

export type UserRating = {
    full_name: string
    image: string
}
