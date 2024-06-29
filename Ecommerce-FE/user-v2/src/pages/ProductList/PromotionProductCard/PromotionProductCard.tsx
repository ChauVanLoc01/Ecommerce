import { Avatar, Text } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { productFetching } from 'src/apis/product'

import Button from 'src/components/Button'
import Image from 'src/components/Image'

import { cn, convertCurrentcy, removeSpecialCharacter } from 'src/utils/utils.ts'

type ProductCardProps = {
    product: any
    isHiddenStore?: boolean
}

const PromotionProductCard = ({ product, isHiddenStore = false }: ProductCardProps) => {
    const { name, image, priceAfter, priceBefore, id } = product

    const { mutate: createViewAddToCart } = useMutation({
        mutationFn: productFetching.createViewAddToCart
    })

    const handleClickProduct = () => {}

    return (
        <motion.article
            className='rounded-12 border border-border/30 bg-[#FFFFFF] hover:shadow-md relative'
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
                            <Avatar fallback='A' src={product?.store?.image} radius='full' size={'2'} />
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
                    </div>
                    <div>
                        <Button className='px-5 py-[10px] text-xs' text='Thêm sản phẩm' />
                    </div>
                </div>
            </div>
            <div
                className={cn('ribbon', {
                    hidden: !priceBefore
                })}
            >
                Giảm {100 - Math.ceil((priceAfter * 100) / priceBefore)}%
            </div>
        </motion.article>
    )
}

export default PromotionProductCard
