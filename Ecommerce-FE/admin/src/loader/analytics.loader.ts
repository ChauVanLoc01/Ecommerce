import { LoaderFunction } from 'react-router-dom'
import { AnalyticApi } from 'src/apis/analytics.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'
import { timeInterval } from 'src/utils/utils'

export const analyticsLoader: LoaderFunction = async () => {
    console.log('analytics load')
    window.dispatchEvent(new Event(loadingFetchingEvent.start))
    const { dayInterval } = timeInterval()

    // await Promise.all([
    //     queryClient.fetchQuery(),
    //     queryClient.fetchQuery({
    //         queryKey: ['numberOfOrderAnalytics'],
    //         queryFn: () => AnalyticApi.numberOfOrderAnalytics(dayInterval),
    //         staleTime: 1000 * 60 * 1
    //     })
    // ])

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
