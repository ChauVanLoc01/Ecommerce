import {
    CategoryResponse,
    ProductAnalyticResponse,
    ProductListResponse,
    ProductQueryAndPagination
} from 'src/types/product.type'
import { http } from './http'

export const ProductApi = {
    getAllCategories: () => {
        return http.get<CategoryResponse>('product/category')
    },
    getAllProduct: (query: ProductQueryAndPagination) => {
        return http.get<ProductListResponse>('product/product/product-store', { params: query })
    },
    productAnalytic: () => {
        return http.get<ProductAnalyticResponse>('product/product/analytic')
    }
}
