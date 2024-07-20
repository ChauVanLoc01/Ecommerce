import { LoaderFunction } from 'react-router-dom'
import { user_api } from 'src/apis/user.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const userLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))

    await queryClient.fetchQuery({
        queryKey: ['users', { limit: 10, page: 1 }],
        queryFn: user_api.getUsers({ limit: 10, page: 1 }),
        staleTime: 1000 * 60 * 1
    })

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
