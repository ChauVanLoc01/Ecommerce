import { LoaderFunction } from 'react-router-dom'
import { ProductApi } from 'src/apis/product.api'
import { queryClient } from 'src/routes/main.route'

export const productLoader: LoaderFunction = async () => {
    const productList = await queryClient.fetchQuery({
        queryKey: ['productList', JSON.stringify({})],
        queryFn: () => ProductApi.getAllProduct({ limit: import.meta.env.VITE_LIMIT }),
        staleTime: 1000 * 60 * 2
    })

    return [
        productList.data.result.data,
        { page: productList.data.result.query.page, page_size: productList.data.result.query.page_size }
    ]
}
