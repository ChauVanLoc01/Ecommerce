import { ProductListResponse, ProductQueryAndPagination } from 'src/types/product.type'
import { http } from './http'

export const ProductApi = {
    getAllProduct: (query: ProductQueryAndPagination) => {
        return http.get<ProductListResponse>('product/product', { params: query })
    }
}
