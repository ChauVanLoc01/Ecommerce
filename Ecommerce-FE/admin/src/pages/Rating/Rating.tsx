import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { RatingAPI } from 'src/apis/rating.api'
import { RatingQuery } from 'src/types/rating.type'
import LayoutProfile from '../Profile/LayoutProfile'
import RatingFilter from './RatingFilter'
import RatingHeader from './RatingHeader'
import RatingTable from './RatingTable'

const Rating = () => {
    const [query, setQuery] = useState<RatingQuery>({ limit: import.meta.env.VITE_LIMIT })

    const { data: ratingList, refetch: ratingListRefetch } = useQuery({
        queryKey: ['ratingList', JSON.stringify(query)],
        queryFn: () => RatingAPI.getAllRating(query),
        staleTime: 1000 * 60 * 2,
        select: (data) => data.data.result
    })

    const refetchDataAll = async () => await Promise.all([ratingListRefetch()])

    return (
        <LayoutProfile title='Quản lý đánh giá' rightNode={<RatingHeader />}>
            <RatingFilter
                setQuery={setQuery}
                page={ratingList?.query.page ?? 0}
                page_size={ratingList?.query.page_size ?? 0}
            />
            <RatingTable data={ratingList?.data ?? []} refetchDataAll={refetchDataAll} />
        </LayoutProfile>
    )
}

export default Rating
