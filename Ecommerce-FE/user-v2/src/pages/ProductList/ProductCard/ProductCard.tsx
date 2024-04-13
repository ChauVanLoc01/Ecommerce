import { useIsFetching } from '@tanstack/react-query'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import Button from 'src/components/Button'
import Image from 'src/components/Image'
import Stars from 'src/components/Stars'
import { endProductDetailFetching, startProductDetailFetching } from 'src/constants/event'
import { AppContext } from 'src/contexts/AppContext'
import { Product } from 'src/types/product.type'
import { convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type ProductCardProps = {
    product: Product
    isLoading?: boolean
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { name, image, priceAfter, priceBefore, id } = product

    const { setProducts, products } = useContext(AppContext)
    const [isFetching, setIsFetching] = useState<boolean>(false)

    const handleAddToCart = () => {
        toast.info('Thêm sản phẩm thành công')
        const index = products.findIndex((p) => p.id === product.id)
        if (index !== -1) {
            products[index].buy += 1
            setProducts(products)
        } else {
            setProducts((repo) => [...repo, { ...product, buy: 1, checked: false }])
        }
    }

    window.addEventListener(startProductDetailFetching, (e: any) => {
        if (e.detail.productDetail === product.id) {
            setIsFetching(true)
        }
    })

    window.addEventListener(endProductDetailFetching, (e: any) => {
        if (e.detail.productDetail === product.id) {
            setIsFetching(false)
        }
    })

    return (
        <motion.article
            className='rounded-12 border border-border/30 bg-[#FFFFFF] hover:shadow-md overflow-hidden'
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, ease: 'backInOut' } }}
            exit={{ opacity: 0 }}
        >
            <Link to={`/${removeSpecialCharacter(name)}-0-${id}`} className='p-[16px] pb-0 inline-block relative'>
                <Image
                    src={image}
                    alt='product-img'
                    className='object-cover overflow-hidden rounded-12 h-[295px] max-h-[295px]'
                    overlay={isFetching}
                />
                <div
                    className={classNames('absolute inset-0 flex justify-center items-center', {
                        '!hidden': !isFetching
                    })}
                >
                    <div className='spinner2' />
                </div>
            </Link>
            <div className='p-[16px] space-y-4'>
                <div className='space-y-1'>
                    <Link
                        to={`/${removeSpecialCharacter(name)}-0-${id}`}
                        className='font-semibold text-base tracking-wide line-clamp-2'
                    >
                        {name}
                    </Link>
                    <h4 className='tracking-wide'>Cannon</h4>
                </div>
                <div className='flex justify-between items-end'>
                    <div>
                        <h3 className='space-x-2 text-base'>
                            <span className='font-semibold'>{convertCurrentcy(priceAfter || 0, 0)}đ</span>
                            <span
                                className={classNames('line-through text-gray-400', {
                                    hidden: !priceBefore
                                })}
                            >
                                {convertCurrentcy(priceBefore || 0, 0)}đ
                            </span>
                        </h3>
                        <Stars amount={5} />
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
