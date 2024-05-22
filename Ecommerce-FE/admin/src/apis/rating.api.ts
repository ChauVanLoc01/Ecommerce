import { RatingListResponse, RatingQuery } from 'src/types/rating.type'
import { http } from './http'

export const RatingAPI = {
    getAllRating: (query: RatingQuery) => {
        return http.get<RatingListResponse>('store/rating/store-rating', {
            params: query
        })
    },
    createNewRating: () => {
        return http.post('store/rating')
    },
    getDetail: (ratingId: string) => {
        return http.get(`store/rating/${ratingId}`)
    }
}
