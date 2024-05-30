import { profileFetching } from 'src/apis/profile'
import { queryClient } from 'src/routes/main.route'
import { loadingEvent } from 'src/utils/utils.ts'

export const deliveryLoader = async () => {
    loadingEvent.start()

    const [deliveries] = await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['delivery'],
            queryFn: profileFetching.getDeliveries,
            staleTime: Infinity,
            gcTime: Infinity
        })
    ])

    loadingEvent.end()

    return [deliveries.data.result]
}
