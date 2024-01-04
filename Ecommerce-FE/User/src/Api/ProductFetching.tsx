import { ProductSearch } from 'src/constants/KeySearch'
import { PathRoute } from 'src/constants/PathRoute'
import { ListCategory } from 'src/types/Category.type'
import { ListProduct, Product } from 'src/types/Product.type'
import { ResponveApi } from 'src/types/Responve.type'
import http from './http'

export const ProductFetching = {
  ProductFetching: (id: string) => {
    return http.get<ResponveApi<Product>>(`${PathRoute.product}/${id}`)
  },
  ListProductFetching: (body: ProductSearch) => {
    return http.get<ResponveApi<ListProduct>>(
      `${PathRoute.listProduct}?${Object.entries(body)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
    )
  },
  ListCategoryFetching: () => {
    return http.get<ResponveApi<ListCategory>>(`${PathRoute.category}`)
  }
}
