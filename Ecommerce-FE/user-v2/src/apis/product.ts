import { Return } from 'src/types/return.type'
import { method } from './method'
import { ProductDetailResponse, ProductListQuery, ProductListResponse } from 'src/types/product.type'
import { CategoryListResponse } from 'src/types/category.type'

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
    }
}
