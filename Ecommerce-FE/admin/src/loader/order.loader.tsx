import { LoaderFunction } from 'react-router-dom'
import { OrderApi } from 'src/apis/order.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const orderLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))

    await Promise.all([
        await queryClient.fetchQuery({
            queryKey: ['orderList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT, createdAt: 'desc' })],
            queryFn: () => OrderApi.getAllOrder({ limit: import.meta.env.VITE_LIMIT, createdAt: 'desc' }),
            staleTime: 1000 * 60
        }),
        await queryClient.fetchQuery({
            queryKey: ['analyticOrderStore'],
            queryFn: OrderApi.analyticOrderStore,
            staleTime: 1000 * 60
        })
    ])

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
