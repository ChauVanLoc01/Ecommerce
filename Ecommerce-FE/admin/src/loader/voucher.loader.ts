import { LoaderFunction } from 'react-router-dom'
import { VoucherApi } from 'src/apis/voucher.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const voucherLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))

    await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['VoucherList', { limit: import.meta.env.VITE_LIMIT, createdAt: 'desc' }],
            queryFn: () => VoucherApi.getAllVoucher({ limit: import.meta.env.VITE_LIMIT, createdAt: 'desc' }),
            staleTime: Infinity
        }),
        queryClient.fetchQuery({
            queryKey: ['VoucherAnalytics'],
            queryFn: VoucherApi.getAnalytics,
            staleTime: Infinity
        })
    ])

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
