import { ProductOrder } from './order.type'
import { ProfileResponse } from './profile.type'
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

export type RatingBody = {
    orderId: string,
    userId: string,
    storeId: string,
    rating: number,
    comment: string
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

export type RatingListResponse = Return<{
    data: {
        rating: Rating
        material: RatingMaterial[]
        user: ProfileResponse
    }[]
    query: { page: number; page_size: number }
}>

export type CreateRatingResponse = Return<{
    cratedRating: Rating
    materials: RatingMaterial[]
}>

export type IsCreateRatingResponse = Return<boolean | ProductOrder[]>
