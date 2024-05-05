import { Return } from 'src/types/return.type'
import { method } from './method'
import { ProductDetailResponse, ProductListQuery, ProductListResponse } from 'src/types/product.type'
import { CategoryListResponse } from 'src/types/category.type'
import { http } from './http'
import { GenericAbortSignal } from 'axios'

const { GET } = method('product')

export const productFetching = {
    categoryList: () => {
        return GET<Return<CategoryListResponse>>('category')
    },
    productList: (query?: ProductListQuery) => {
        return GET<Return<ProductListResponse>, ProductListQuery>('product', query)
    },
    productDetail: (param: string) => {
        return GET<Return<ProductDetailResponse>, ProductListQuery>(`product/${param}`)
    },
    getAllProductByStore: (storeId: string, query: ProductListQuery, signal?: GenericAbortSignal) => {
        return http.get<Return<ProductListResponse>>(`product/product/product-store/${storeId}`, {
            params: query,
            signal
        })
    }
}
