import { Category, Product } from '@prisma/client'

export type ProductSearchBody = Pick<Product, 'id' | 'name' | 'description'> &
  Pick<Category, 'shortname'>

export type ProductSearchResult = {
  hits: {
    total: number
    hits: {
      _source: ProductSearchBody
    }[]
  }
}
