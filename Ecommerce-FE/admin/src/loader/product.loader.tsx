import { keyBy } from 'lodash'
import { LoaderFunction } from 'react-router-dom'
import { ProductApi } from 'src/apis/product.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const productLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))

    const [_, productAnalytic, categories] = await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['productList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT })],
            queryFn: () => ProductApi.getAllProduct({ limit: import.meta.env.VITE_LIMIT }),
            staleTime: 1000 * 60 * 1
        }),
        queryClient.fetchQuery({
            queryKey: ['productAnalytic'],
            queryFn: ProductApi.productAnalytic
        }),
        queryClient.fetchQuery({
            queryKey: ['categories'],
            queryFn: ProductApi.getAllCategories
        })
    ])

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return [productAnalytic.data, keyBy(categories.data.result, 'shortname')]
}
