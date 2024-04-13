type Category = {
  _id: string
  name: string
  __v: number
}

export type Product = {
  _id: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  name: string
  description: string
  category: Category
  image: string
  createdAt: string
  updatedAt: string
}

export type ListProduct = {
  products: Omit<Product, 'description'>[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}
export type productsOfListProduct = ListProduct['products']
