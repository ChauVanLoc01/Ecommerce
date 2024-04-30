import { Checkbox, Text } from '@radix-ui/themes'
import { motion, Reorder } from 'framer-motion'
import { useContext, useState } from 'react'
import { AppContext } from 'src/contexts/AppContext'
import { ls } from 'src/utils/localStorage'
import { cn } from 'src/utils/utils.ts'
import ProductIncart from './ProductInCart'

type CartItemProps = {
    storeId: string
}

const CartItem = ({ storeId }: CartItemProps) => {
    const { products, setProducts } = useContext(AppContext)
    const [productOrder, setProductOrder] = useState<string[]>(Object.keys(products.products))

    const handleCheckedAll = (status: boolean) => {
        var storeExist = products.products[storeId].map((product) => {
            return { ...product, checked: status }
        })
        const newProducts = {
            ...products,
            products: {
                ...products.products,
                [storeId]: storeExist
            }
        }
        ls.deleteItem('products')
        ls.setItem('products', JSON.stringify(newProducts))
        setProducts(newProducts)
    }

    return (
        <motion.div
            className={cn('bg-[#FFFFFF] rounded-8', {
                'border border-border/30 hover:shadow-sm': products.length > 0
            })}
        >
            {products.length > 0 && (
                <motion.div key={storeId} className='border-b border-border/30 flex-shrink'>
                    <div className='p-24 space-x-5 flex items-center'>
                        <Checkbox
                            checked={products.products[storeId].every((productInLS) => productInLS.checked)}
                            onCheckedChange={handleCheckedAll}
                        />
                        <Text>Cửa hàng</Text>
                    </div>
                </motion.div>
            )}
            <Reorder.Group as='ul' axis='y' values={productOrder} onReorder={setProductOrder}>
                {Object.values(products.products[storeId]).map((product) => (
                    <Reorder.Item key={product.productId} value={product}>
                        <ProductIncart storeId={storeId} product={product} />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </motion.div>
    )
}

export default CartItem
