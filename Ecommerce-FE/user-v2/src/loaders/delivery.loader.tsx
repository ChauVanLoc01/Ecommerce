import { QueryClient } from '@tanstack/react-query'
import { profileFetching } from 'src/apis/profile'

export const deliveryLoader = async () => {
    const queryClient = new QueryClient()
    const deliveries = await queryClient.fetchQuery({
        queryKey: ['delivery'],
        queryFn: profileFetching.getDeliveries,
        gcTime: 2000
    })
    return [deliveries.data.result]
}
