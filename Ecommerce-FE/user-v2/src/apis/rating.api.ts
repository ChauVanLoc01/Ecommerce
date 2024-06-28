import {
    CreateRatingBody,
    CreateRatingResponse,
    IsCreateRatingResponse,
    RatingListResponse,
    RatingQuery
} from 'src/types/rating.type'
import { http } from './http'

export const RatingApi = {
    createNewRating: (body: CreateRatingBody) => {
        return http.post<CreateRatingResponse>('/store/rating', body)
    },
    getProductRating: (body: { productId: string, storeId: string, limit: number, page: number }) => {
        return http.get<RatingListResponse>(`/store/rating/product-rating/${body.productId}`, {
            params: {
                limit: body.limit,
                page: body.page
            }
        })
    },
    canCreateRating: (productId: string) => {
        return http.get<IsCreateRatingResponse>(`/store/rating/is-can-create-rating/${productId}`)
    }
}
