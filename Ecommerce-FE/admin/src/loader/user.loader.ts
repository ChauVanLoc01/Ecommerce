import { LoaderFunction } from 'react-router-dom'
import { user_api } from 'src/apis/user.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const userLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))
    console.log('user loader')
    await queryClient.fetchQuery({
        queryKey: ['users', { page: 1, limit: 10 }],
        queryFn: user_api.getUsers({ page: 1, limit: 10 }),
        staleTime: 1000 * 60 * 1
    })

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
