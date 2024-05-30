import { Checkbox, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { motion, Reorder } from 'framer-motion'
import { useContext, useState } from 'react'
import { StoreFetching } from 'src/apis/store'
import { AppContext } from 'src/contexts/AppContext'
import { ls } from 'src/utils/localStorage'
import { cn } from 'src/utils/utils.ts'
import ProductIncart from './ProductInCart'
import { ProductContextExtends } from 'src/types/context.type'
import { Store } from 'src/types/store.type'

type CartItemProps = {
    products: ProductContextExtends[]
    productIds: string[]
    store: Store
    isCheckedAll: boolean
}

const CartItem = ({ products, productIds, store, isCheckedAll }: CartItemProps) => {
    const [productOrder, setProductOrder] = useState<string[]>(productIds)

    const handleCheckedAll = (status: boolean) => {
        // var storeExist = products.products[storeId].map((product) => {
        //     return { ...product, checked: status }
        // })
        // const newProducts = {
        //     ...products,
        //     products: {
        //         ...products.products,
        //         [storeId]: storeExist
        //     }
        // }
        // ls.deleteItem('products')
        // ls.setItem('products', JSON.stringify(newProducts))
        // setProducts(newProducts)
    }

    return (
        <motion.div
            className={cn('bg-[#FFFFFF] rounded-8 hover:shadow-md', {
                'border border-border/30 hover:shadow-sm': products.length > 0
            })}
        >
            {products.length > 0 && (
                <motion.div key={store.id} className='border-b border-border/30 flex-shrink'>
                    <div className='p-24 space-x-5 flex items-center'>
                        <Checkbox checked={isCheckedAll} onCheckedChange={handleCheckedAll} />
                        <Text>{store.name}</Text>
                    </div>
                </motion.div>
            )}
            <Reorder.Group as='ul' axis='y' values={productOrder} onReorder={setProductOrder}>
                {products.map((product) => (
                    <Reorder.Item key={product.productId} value={product}>
                        <ProductIncart storeId={storeId} product={product} />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </motion.div>
    )
}

export default CartItem
