import { GenericAbortSignal } from 'axios'
import { CategoryListResponse } from 'src/types/category.type'
import {
    ProductDetailResponse,
    ProductListQuery,
    ProductListResponse,
    ProductSearch,
    RefreshProduct,
    SalesPromotion,
    SalesPromotionAndProduct
} from 'src/types/product.type'
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
    },
    createViewProduct: (body: { productId: string; userId?: string }) => {
        return http.post('/product/product/view-product', body)
    },
    createViewAddToCart: (body: { productId: string; quantity: number }) => {
        return http.post('/product/product/add-product-to-cart', body)
    },
    searchProduct: (params: { query: string; scroll: string; scroll_id?: string }) => {
        return http.get<ProductSearch>('/product/search-product', {
            params
        })
    },
    getAllSalePromotionProduct: (salesPromotionId: string, query: ProductListQuery) => {
        return (
            http.get<Return<ProductListQuery>, ProductListQuery>(`store/sale-promotion/${salesPromotionId}/product`),
            {
                query
            }
        )
    }
}
