import {
    CategoryResponse,
    Product,
    ProductAnalyticResponse,
    ProductListResponse,
    ProductQueryAndPagination,
    UpdateProductBody
} from 'src/types/product.type'
import { http } from './http'

export const ProductApi = {
    getAllCategories: () => {
        return http.get<CategoryResponse>('product/category')
    },
    getAllProduct: (query: ProductQueryAndPagination) => {
        return http.get<ProductListResponse>('product/product/product-store', { params: query })
    },
    updateProduct: (input: {productId: string, body: UpdateProductBody}) => {
        return http.put<Product>(`product/product/${input.productId}`, input.body)
    },
    productAnalytic: () => {
        return http.get<ProductAnalyticResponse>('product/product/analytic')
    }
}
