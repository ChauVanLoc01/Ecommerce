import { add, startOfDay } from 'date-fns'
import { LoaderFunction } from 'react-router-dom'
import { sale_api } from 'src/apis/sale.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const flashSaleLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))

    await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['salePromotion'],
            queryFn: () => sale_api.getSalePromotion(add(startOfDay(new Date()), { hours: 7 }).toISOString()),
            staleTime: Infinity
        })
    ])

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
