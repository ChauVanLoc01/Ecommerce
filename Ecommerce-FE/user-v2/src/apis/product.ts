import { GenericAbortSignal } from 'axios'
import { CategoryListResponse } from 'src/types/category.type'
import { ProductDetailResponse, ProductListQuery, ProductListResponse, RefreshProduct } from 'src/types/product.type'
import { Return } from 'src/types/return.type'
import { http } from './http'
import { method } from './method'

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
    },
    refreshProduct: (body: string[]) => {
        return http.post<Return<RefreshProduct>>('/product/product/refresh-cart', { productsId: body })
    }
}
