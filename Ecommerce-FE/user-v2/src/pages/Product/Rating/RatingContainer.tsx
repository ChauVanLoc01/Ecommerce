import { DataRatingListResponse } from 'src/types/rating.type'
import RatingParent from './RatingParent'

type RatingContainerProps = {
    rating: DataRatingListResponse['data']['ratings'][number]
}

const RatingContainer = ({ rating }: RatingContainerProps) => {
    return (
        <div>
            <RatingParent data={rating} />
        </div>
    )
}

export default RatingContainer
