import { RatingTableResponse, RatingQuery, RatingReplyBody } from 'src/types/rating.type'
import { http } from './http'

export const RatingAPI = {
    getAllRating: (query: RatingQuery) => {
        return http.get<RatingTableResponse>('store/rating/store-rating', {
            params: query
        })
    },
    createNewRating: () => {
        return http.post('store/rating')
    },
    getDetail: (ratingId: string) => {
        return http.get(`store/rating/${ratingId}`)
    },
    replyRating: (body: RatingReplyBody) => {
        return http.post('store/rating/reply', body)
    }
}
