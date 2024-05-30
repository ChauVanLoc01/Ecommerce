import { Avatar, Text } from '@radix-ui/themes'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import Button from 'src/components/Button'
import Image from 'src/components/Image'
import Stars from 'src/components/Stars'
import { AppContext } from 'src/contexts/AppContext'
import { Product } from 'src/types/product.type'
import { ls } from 'src/utils/localStorage'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type ProductCardProps = {
    product: Product
    isHiddenStore?: boolean
}

const ProductCard = ({ product, isHiddenStore = false }: ProductCardProps) => {
    const { name, image, priceAfter, priceBefore, id } = product

    const { setProducts, products } = useContext(AppContext)

    const handleAddToCart = () => {
        var isNewProductInStoreExist = true
        var productsTmp = products
        var storeExist = productsTmp.products[product.storeId]
        if (!storeExist) {
            productsTmp = {
                length: productsTmp.length + 1,
                products: {
                    ...productsTmp.products,
                    [product.storeId]: [
                        {
                            productId: product.id,
                            buy: 1,
                            name: product.name,
                            image: product.image,
                            priceAfter: product.priceAfter,
                            checked: false
                        }
                    ]
                }
            }
        } else {
            storeExist = storeExist.map((productInLS) => {
                if (product.id === productInLS.productId) {
                    isNewProductInStoreExist = false
                    return {
                        ...productInLS,
                        buy: productInLS.buy + 1
                    }
                }
                return productInLS
            })
            if (isNewProductInStoreExist)
                storeExist.push({
                    buy: 1,
                    productId: product.id,
                    image: product.image,
                    name: product.name,
                    priceAfter: product.priceAfter,
                    checked: false
                })
            productsTmp = {
                ...productsTmp,
                length: isNewProductInStoreExist ? productsTmp.length + 1 : productsTmp.length,
                products: {
                    ...productsTmp.products,
                    [product.storeId]: storeExist
                }
            }
        }
        ls.deleteItem('products')
        ls.setItem('products', JSON.stringify(productsTmp))
        setProducts(productsTmp)
        toast.info('Thêm sản phẩm thành công')
    }

    return (
        <motion.article
            className='rounded-12 border border-border/30 bg-[#FFFFFF] hover:shadow-md overflow-hidden'
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, ease: 'backInOut' } }}
            exit={{ opacity: 0 }}
        >
            <Link
                to={`/${removeSpecialCharacter(name)}-0-${id}`}
                className='p-[16px] pb-0 inline-block relative w-full'
            >
                <Image
                    src={image}
                    alt='product-img'
                    className='object-cover overflow-hidden rounded-12 h-[295px] max-h-[295px] w-full bg-center'
                    loading='lazy'
                />
            </Link>
            <div className='p-[16px] space-y-4'>
                <div className='space-y-1'>
                    <Link
                        to={`/${removeSpecialCharacter(name)}-0-${id}`}
                        className='font-semibold text-base tracking-wide line-clamp-2'
                    >
                        {name}
                    </Link>
                    {!isHiddenStore && (
                        <Link
                            to={`/store/${product.storeId}`}
                            className='flex items-center space-x-3 cursor-pointer group'
                        >
                            <Avatar fallback='A' src={product.store.image} radius='full' size={'2'} />
                            <Text className='group-hover:text-gray-500'>{product.store.name}</Text>
                        </Link>
                    )}
                </div>
                <div className='flex justify-between items-end'>
                    <div>
                        <h3 className='space-x-2 text-base'>
                            <span className='font-semibold'>{convertCurrentcy(priceAfter || 0, 0)}</span>
                            <span
                                className={classNames('line-through text-gray-400', {
                                    hidden: !priceBefore
                                })}
                            >
                                {convertCurrentcy(priceBefore || 0, 0)}
                            </span>
                        </h3>
                        <Stars rating={3} />
                    </div>
                    <div>
                        <Button className='px-5 py-[10px] text-xs' text='Add' onClick={handleAddToCart} />
                    </div>
                </div>
            </div>
        </motion.article>
    )
}

export default ProductCard
