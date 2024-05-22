import { LoaderFunction } from 'react-router-dom'
import { RatingAPI } from 'src/apis/rating.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const ratingLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))

    await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['ratingList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT })],
            queryFn: () => RatingAPI.getAllRating({ limit: import.meta.env.VITE_LIMIT }),
            staleTime: 1000 * 60 * 2
        })
    ])

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
