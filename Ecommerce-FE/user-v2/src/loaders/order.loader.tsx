import { LoaderFunction } from 'react-router-dom'
import { OrderFetching } from 'src/apis/order'
import { queryClient } from 'src/routes/main.route'
import { loadingEvent } from 'src/utils/utils.ts'

export const ordersLoader: LoaderFunction = async () => {
    loadingEvent.start()

    const orderList = await queryClient.fetchQuery({
        queryKey: [
            'orders',
            JSON.stringify({
                createdAt: 'desc'
            })
        ],
        queryFn: () =>
            OrderFetching.getAllOrder({
                createdAt: 'desc'
            }),
        staleTime: 1000 * 60 * 3
    })

    loadingEvent.end()

    return [orderList.data.result]
}
