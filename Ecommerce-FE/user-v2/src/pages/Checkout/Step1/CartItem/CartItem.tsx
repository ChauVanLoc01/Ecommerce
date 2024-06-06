import { Checkbox, Text } from '@radix-ui/themes'
import { motion, Reorder } from 'framer-motion'
import { isUndefined, omitBy } from 'lodash'
import { useContext, useState } from 'react'
import { AppContext } from 'src/contexts/AppContext'
import { ProductContextExtends } from 'src/types/context.type'
import { Store } from 'src/types/store.type'
import { cn } from 'src/utils/utils.ts'
import ProductIncart from './ProductInCart'

type CartItemProps = {
    products: { [productId: string]: ProductContextExtends }
    productIds: string[]
    store: Store
    isCheckedAll: boolean
    handleRemoveVoucher: () => void
}

const CartItem = ({ products, productIds, store, isCheckedAll, handleRemoveVoucher }: CartItemProps) => {
    const { setProducts, ids } = useContext(AppContext)
    const [productOrder, setProductOrder] = useState<string[]>(productIds)

    const handleCheckedAll = () => {
        setProducts((pre) => ({
            ...pre,
            products: {
                ...pre.products,
                [store.id]: Object.values(products).map((product) => ({ ...product, checked: !isCheckedAll }))
            }
        }))
        handleRemoveVoucher()
    }

    const handleChecked = (productId: string, checked: boolean) => () => {
        setProducts((pre) => ({
            ...pre,
            products: {
                ...pre.products,
                [store.id]: Object.values({
                    ...products,
                    [productId]: {
                        ...products[productId],
                        checked
                    }
                })
            }
        }))
        handleRemoveVoucher()
    }

    const handleChangeQuantity = (productId: string, buy: number) => {
        setProducts((pre) => ({
            ...pre,
            products: {
                ...pre.products,
                [store.id]: Object.values({
                    ...products,
                    [productId]: {
                        ...products[productId],
                        buy
                    }
                })
            }
        }))
    }

    const handleDelete = (productId: string) => () => {
        delete products[productId]
        setProducts((pre) => {
            return {
                ...pre,
                products: omitBy(
                    {
                        ...pre.products,
                        [store.id]: !Object.values({
                            ...products
                        }).length
                            ? undefined
                            : Object.values({
                                  ...products
                              })
                    },
                    isUndefined
                ) as any
            }
        })
    }

    return (
        <motion.div className={cn('bg-[#FFFFFF] rounded-8 hover:shadow-md border border-border/30')}>
            <motion.div key={store.id} className='border-b border-border/30 flex-shrink'>
                <div className='p-24 space-x-5 flex items-center'>
                    <Checkbox id={store.id} checked={isCheckedAll} onCheckedChange={handleCheckedAll} />
                    <Text as='label' htmlFor={store.id}>
                        {store.name}
                    </Text>
                </div>
            </motion.div>
            <Reorder.Group as='ul' axis='y' values={productOrder} onReorder={setProductOrder}>
                {Object.values(products).map((product) => (
                    <Reorder.Item key={product.productId} value={product}>
                        <ProductIncart
                            product={product}
                            handleChecked={handleChecked}
                            handleChangeQuantity={handleChangeQuantity}
                            handleDelete={handleDelete}
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </motion.div>
    )
}

export default CartItem
