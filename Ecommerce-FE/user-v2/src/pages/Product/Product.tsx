import SimpleBar from 'simplebar-react'

import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import Stars from 'src/components/Stars'

import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useContext, useState } from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { ProductDetailResponse, ProductListResponse } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils.ts'
import MaybeULike from './MaybeULike'
import Review from './Review'

const Product = () => {
    const { setProducts, products } = useContext(AppContext)
    const [quantity, setQuantity] = useState<number>(1)
    const [productDetail, relativedProducts] = useLoaderData() as [ProductDetailResponse, ProductListResponse]
    const navigate = useNavigate()

    const handleAddToCart = (checked: boolean) => () => {
        toast.info('Thêm sản phẩm thành công')
        const index = products.findIndex((p) => p.id === productDetail.id)
        if (index !== -1) {
            products[index].buy += quantity
            setProducts(products)
        } else {
            setProducts((repo) => [...repo, { ...productDetail, buy: quantity, checked: checked ?? false }])
        }
    }

    const handleCheckout = () => {
        handleAddToCart(true)()
        navigate(`/${route.checkout}`)
    }

    return (
        <motion.div
            initial='hidden'
            animate='visible'
            exit='hidden'
            transition={{ duration: 0.8 }}
            variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 }
            }}
            className='space-y-4 pb-20'
        >
            <section className='flex gap-10'>
                <div className='basis-2/5 max-w-[40%] grow-0 bg-[#FFFFFF] rounded-12 flex-shrink-0 overflow-hidden w-[512px] h-[512px]'>
                    <img src={productDetail.image} className='object-cover w-full h-full' />
                </div>
                <div className='space-y-3'>
                    <Stars amount={3} />
                    <h3 className='font-semibold text-2xl tracking-wider'>{productDetail.name}</h3>
                    <p className='tracking-wider leading-5'>{productDetail.description}</p>
                    <InputNumber quantity={quantity} setQuantity={setQuantity} />
                    <div className='space-x-3 text-2xl'>
                        <span className='text-red-600'>{convertCurrentcy(productDetail.priceAfter || 0, 0)}đ</span>
                        <span
                            className={classNames('line-through text-gray-400', {
                                hidden: !productDetail.priceBefore
                            })}
                        >
                            {convertCurrentcy(productDetail.priceBefore || 0, 0)}đ
                        </span>
                    </div>
                    <div className='flex justify-start gap-3'>
                        <Button
                            className='w-fit bg-red-600 hover:bg-red-700'
                            text='Mua ngay'
                            onClick={handleCheckout}
                        />
                        <Button className='w-fit' text='Thêm vào giỏ hàng' onClick={handleAddToCart(false)} />
                    </div>
                </div>
            </section>
            <div className='flex gap-4'>
                <section className='bg-[#FFFFFF] rounded-12 border border-border/30 p-[24px] basis-1/2 space-y-4 sticky top-0'>
                    <div className='rounded-12 border border-border/30 p-[24px] flex'>
                        <div className='basis-1/3 space-y-2'>
                            <div className='space-x-2 text-2xl relative'>
                                <span className='font-semibold'>4</span>
                                <span className='text-lg absolute top-1/2 -translate-y-1/2 text-gray-500'>/5</span>
                            </div>
                            <h3 className='tracking-wide'>Dựa trên 13 đánh giá</h3>
                            <Stars amount={4} />
                        </div>
                    </div>
                    <SimpleBar style={{ maxHeight: 708 }}>
                        <div className='space-y-4'>
                            <Review />
                            <Review />
                            <Review />
                            <Review />
                            <Review />
                            <Review />
                        </div>
                    </SimpleBar>
                </section>
                <section className='bg-[#FFFFFF] rounded-12 border border-border/30 basis-1/2 sticky top-0'>
                    <div className='border-b border-border/30 p-[24px]'>
                        <h3 className='text-base font-semibold tracking-wide'>Có thể bạn sẽ thích</h3>
                    </div>
                    <SimpleBar style={{ maxHeight: 810 }}>
                        <div className='divide-y divide-border/30'>
                            {relativedProducts.data.map((relative) => (
                                <MaybeULike key={relative.id} product={relative} />
                            ))}
                        </div>
                    </SimpleBar>
                </section>
            </div>
        </motion.div>
    )
}

export default Product
