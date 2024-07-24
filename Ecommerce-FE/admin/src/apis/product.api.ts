import {
    CategoryResponse,
    Product,
    ProductAnalyticResponse,
    ProductListResponse,
    ProductOrderReponse,
    ProductQueryAndPagination,
    UpdateProductBody
} from 'src/types/product.type'
import { CreateProductSchema } from 'src/utils/product.schema'
import { http } from './http'

export const ProductApi = {
    getAllCategories: () => {
        return http.get<CategoryResponse>('product/category')
    },
    getAllProduct: (data: { storeId: string; query: ProductQueryAndPagination }) => {
        return http.get<ProductListResponse>(`product/product/product-store/${data.storeId}`, {
            params: data.query
        })
    },
    updateProduct: (productId: string) => (body: UpdateProductBody) => {
        return http.put<Partial<Product>>(`product/product/${productId}`, body)
    },
    productAnalytic: () => {
        return http.get<ProductAnalyticResponse>('product/product/analytic')
    },
    getProductOrderByOrderId: (orderId: string) => {
        return http.get<ProductOrderReponse>(`product/product/product-order/${orderId}`)
    },
    createProduct: (body: CreateProductSchema & { productImages: string[]; imagePrimary: string }) => {
        return http.post('product/product', body)
    }
}
