import { RatingTableResponse, RatingQuery, RatingReplyBody } from 'src/types/rating.type'
import { http } from './http'
import { Return } from 'src/types/return.type'

export const RatingAPI = {
    getAllRating: (query: RatingQuery) => {
        return http.get<RatingTableResponse>('store/rating/store-rating', {
            params: query
        })
    },
    getProfileUserInRating: (userId: string) => () => {
        return http.get<Return<{ full_name: string; email: string; image: string; id: string }>>(
            `user/profile/user-profile/${userId}`
        )
    },
    createNewRating: () => {
        return http.post('store/rating')
    },
    getDetail: (ratingId: string) => () => {
        return http.get(`rating/rating-detail/${ratingId}/store`)
    },
    replyRating: (body: RatingReplyBody) => {
        return http.post('store/rating/reply', body)
    }
}
