import { profileFetching } from 'src/apis/profile'
import { queryClient } from 'src/routes/main.route'

export const deliveryLoader = async () => {
    const deliveries = await queryClient.fetchQuery({
        queryKey: ['delivery'],
        queryFn: profileFetching.getDeliveries,
        gcTime: 2000
    })
    return [deliveries.data.result]
}
