import { LoaderFunction } from 'react-router-dom'
import { store_api } from 'src/apis/store.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const storeLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))
    await queryClient.fetchQuery({
        queryKey: ['stores', { page: 1, limit: 10, search_key: '' }],
        queryFn: store_api.getStores({ page: 1, limit: 10, search_key: '' }),
        staleTime: 1000 * 60 * 1
    })

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
