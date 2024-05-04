import { LoaderFunction } from 'react-router-dom'
import { OrderFetching } from 'src/apis/order'
import { queryClient } from 'src/routes/main.route'

export const ordersLoader: LoaderFunction = async () => {
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
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 50
    })

    return [orderList.data.result]
}
