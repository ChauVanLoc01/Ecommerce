import { TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Checkbox, Flex, IconButton, Text, Tooltip } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { debounce } from 'lodash'
import { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { productFetching } from 'src/apis/product'
import InputNumber from 'src/components/InputNumber'
import { AppContext } from 'src/contexts/AppContext'
import { ls } from 'src/utils/localStorage'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type ProductInCartType = {
    storeId: string
    product: {
        buy: number
        productId: string
        name: string
        image: string
        priceAfter: number
        checked: boolean
    }
}

const ProductIncart = ({ product, storeId }: ProductInCartType) => {
    const { setProducts, products } = useContext(AppContext)
    const [quantity, setQuantity] = useState<number>(product.buy)
    const debounceRef = useRef<any>()

    const productsId = Object.keys(products.products).reduce((acum: any, e) => {
        const storeIds = products.products[e].map((i) => i.productId)
        return [...acum, ...storeIds]
    }, [])

    const { data: refreshProducts } = useQuery({
        queryKey: ['refreshProduct', productsId],
        queryFn: () => productFetching.refreshProduct(productsId),
        refetchInterval: 1000 * 60,
        enabled: false,
        select: (data) => data.data.result
    })

    const handleCheckBox = (checked: boolean) => {
        var storeExist = products.products[storeId]
        storeExist = storeExist.map((productInStore) => {
            if (productInStore.productId === product.productId) {
                return {
                    ...productInStore,
                    checked
                }
            }
            return productInStore
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

    const handleDeleteProduct = () => {
        var storeExist = products.products[storeId]
        storeExist = storeExist.filter((productInLS) => productInLS.productId !== product.productId)
        const newProducts = {
            ...products,
            length: products.length - 1,
            products: {
                ...products.products,
                [storeId]: storeExist
            }
        }
        if (!storeExist.length) {
            delete newProducts.products[storeId]
        }
        ls.deleteItem('products')
        ls.setItem('products', JSON.stringify(newProducts))
        setProducts(newProducts)
        toast.success('Xóa sản phẩm thành công')
    }

    useEffect(() => {
        debounceRef.current = debounce(() => {
            var storeExist = products.products[storeId]
            storeExist = storeExist.map((productInStore) => {
                if (productInStore.productId === product.productId) {
                    return {
                        ...productInStore,
                        buy: quantity
                    }
                }
                return productInStore
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
        }, 1000)
        debounceRef.current()

        return () => {
            debounceRef.current.cancel()
        }
    }, [quantity])

    return (
        <motion.div className='px-24 pt-24 [&:last-child]:pb-24 space-x-5 flex items-center max-h-[130px]'>
            <Checkbox checked={product.checked} onCheckedChange={handleCheckBox} id={product.productId} />
            <Link
                to={`/${removeSpecialCharacter(product.name)}-0-${product.productId}`}
                className='max-w-16 max-h-16 w-16 h-16 border border-border/30 flex-shrink-0 rounded-12 overflow-hidden'
            >
                <img src={product?.image} alt='cart-item' className='object-cover w-16 h-16' />
            </Link>
            <div className='space-y-2 flex-grow '>
                <Link
                    to={`/${removeSpecialCharacter(product.name)}-0-${product.productId}`}
                    className='font-semibold line-clamp-2'
                >
                    <Text>{product?.name}</Text>
                </Link>
                <h3 className='text-gray-400'>Red</h3>
            </div>
            <div className='flex items-center space-x-4'>
                <h3 className='font-semibold'>
                    {convertCurrentcy((refreshProducts as any)[product.productId].priceAfter || 0, 0)}
                </h3>
                <InputNumber
                    quantity={quantity}
                    setQuantity={setQuantity}
                    currentQuantity={(refreshProducts as any)[product.productId].currentQuantity}
                />
                <AlertDialog.Root>
                    <AlertDialog.Trigger>
                        <IconButton color='red'>
                            <Tooltip content='Xóa'>
                                <TrashIcon />
                            </Tooltip>
                        </IconButton>
                    </AlertDialog.Trigger>
                    <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                        <AlertDialog.Title>Xác nhận xóa sản phẩm</AlertDialog.Title>
                        <AlertDialog.Description size='2'>
                            Bạn có chắc rằng muốn xóa sản phẩm ra khỏi giỏ hàng?
                        </AlertDialog.Description>
                        <Flex justify={'end'} gapX={'3'} className='mt-5'>
                            <AlertDialog.Cancel>
                                <Button variant='outline' color='red'>
                                    Hủy
                                </Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                                <Button onClick={handleDeleteProduct}>Xác nhận</Button>
                            </AlertDialog.Action>
                        </Flex>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            </div>
        </motion.div>
    )
}

export default ProductIncart
