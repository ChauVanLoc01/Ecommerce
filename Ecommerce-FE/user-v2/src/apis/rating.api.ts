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
    getProductRating: (body: { productId: string; storeId: string } & RatingQuery) => () => {
        return http.get<RatingListResponse>(`/store/rating/product-rating/${body.productId}/store/${body.storeId}`, {
            params: {
                limit: body.limit,
                page: body.page
            }
        })
    }
}
