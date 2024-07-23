import {
    CreateRatingBody,
    CreateRatingResponse,
    RatingListResponse,
    RatingQuery,
    UserRating
} from 'src/types/rating.type'
import { Return } from 'src/types/return.type'
import { http } from './http'

export const RatingApi = {
    createNewRating: (body: CreateRatingBody) => {
        return http.post<CreateRatingResponse>('/store/rating', body)
    },
    getProductRating: (body: { productId: string; storeId: string } & RatingQuery) => () => {
        return http.get<RatingListResponse>(`/store/rating/product-rating/${body.productId}/store/${body.storeId}`, {
            params: {
                limit: body.limit,
                page: body.page
            }
        })
    },
    getRatingUserProfile: (userId: string) => () => {
        return http.get<Return<UserRating>>(`/user/profile/rating/${userId}`)
    },
    getMaterialOfRating: (ratingId: string) => () => {
        return http.get<Return<string[]>>(`store/rating/material/${ratingId}`)
    }
}
