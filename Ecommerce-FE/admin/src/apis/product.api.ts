import { User } from 'src/types/auth.type'
import {
    CategoryResponse,
    Product,
    ProductAnalyticResponse,
    ProductListResponse,
    ProductOrderReponse,
    ProductQueryAndPagination,
    UpdateProductBody
} from 'src/types/product.type'
import { ls } from 'src/utils/localStorage'
import { http } from './http'

const storeId = ls.getItem('profile') ? (JSON.parse(ls.getItem('profile') as string) as User).id : undefined

export const ProductApi = {
    getAllCategories: () => {
        return http.get<CategoryResponse>('product/category')
    },
    getAllProduct: (query: ProductQueryAndPagination) => {
        return http.get<ProductListResponse>(`product/product/product-store/${storeId}`, {
            params: query
        })
    },
    updateProduct: (data: { productId: string; body: UpdateProductBody }) => {
        return http.put<Product>(`product/product/${data.productId}`, data.body)
    },
    productAnalytic: () => {
        return http.get<ProductAnalyticResponse>('product/product/analytic')
    },
    getProductOrderByOrderId: (orderId: string) => {
        return http.get<ProductOrderReponse>(`product/product/product-order/${orderId}`)
    }
}
