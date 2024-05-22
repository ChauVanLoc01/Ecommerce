import { CreateRatingResponse, RatingListResponse, RatingQuery } from 'src/types/rating.type'
import { CreateRating } from 'src/utils/rating.schema'
import { http } from './http'

export const RatingApi = {
    createNewRating: (body: CreateRating) => {
        return http.post<CreateRatingResponse>('/store/store/rating', body)
    },
    getAllRating: (body: { productId: string } & RatingQuery) => {
        return http.get<RatingListResponse>(`/store/rating/product-rating/${body.productId}`, {
            params: {
                limit: body.limit,
                page: body.page
            }
        })
    }
}
