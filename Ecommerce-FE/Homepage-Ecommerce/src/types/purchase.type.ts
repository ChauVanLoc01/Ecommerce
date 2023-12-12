import { Category } from './Category.type'
import { Product } from './Product.type'

export type Order = {
  product_id: string
  buy_count: number
}
export type Purchase = {
  buy_count: number
  createdAt: string
  price: number
  price_before_discount: number
  product: Product
  status: number
  updatedAt: string
  user: string
  __v: number
  _id: string
}
export type ListPurchase = Purchase[]
