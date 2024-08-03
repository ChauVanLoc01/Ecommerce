import InputNumber from 'src/components/InputNumber'

import { Avatar, Button, Flex, Text } from '@radix-ui/themes'
import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { productFetching } from 'src/apis/product'
import { sale_api } from 'src/apis/sale_promotion.api'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { ProductOrderSale } from 'src/types/context.type'
import { ProductDetailResponse, ProductListResponse } from 'src/types/product.type'
import { Store } from 'src/types/store.type'
import { convertCurrentcy } from 'src/utils/utils.ts'
import Countdown from '../ProductList/FlashSale/Countdown'
import ProductRecomend from './ProductRecomend'
import RatingList from './Rating/RatingList'

const Product = () => {
    const { addToCart, profile, currentSaleId } = useContext(AppContext)
    const [quantity, setQuantity] = useState<number>(1)
    const [productDetail, _, storeDetail] = useLoaderData() as [ProductDetailResponse, ProductListResponse, Store]
    const navigate = useNavigate()

    const { data: productSale } = useQuery({
        queryKey: ['product-sale', productDetail?.id],
        queryFn: ({ signal }) => sale_api.getProducSale(currentSaleId, productDetail.id, signal),
        staleTime: 1000 * 60 * 5,
        select: (result) => result.data.result,
        enabled: !!currentSaleId
    })

    const { mutate: createViewProduct } = useMutation({
        mutationFn: productFetching.createViewProduct
    })

    const handleAddToCart = (isChecked: boolean) => () => {
        if (!profile) {
            toast.error('Cần đăng nhập trước khi thực hiện mua hàng')
        } else {
            const { name, image, category, priceAfter, id, storeId, currentQuantity } = productDetail
            let payload = {
                productId: id,
                name,
                image,
                priceAfter,
                buy: quantity,
                currentQuantity,
                isChecked,
                isExist: true,
                storeId,
                category
            }
            if (currentSaleId && productSale) {
                let { currentQuantity, id, priceAfter } = productSale
                payload = {
                    ...payload,
                    sale: {
                        currentQuantity,
                        priceAfter,
                        productPromotionId: id,
                        salePromotionId: currentSaleId
                    }
                } as ProductOrderSale
            }
            addToCart(storeId, storeDetail.name, payload)
            setQuantity(1)
        }
    }

    const handleCheckout = () => {
        handleAddToCart(true)()
        navigate(`/${route.checkout}`)
    }

    useEffect(() => {
        createViewProduct({ storeId: storeDetail.id, productId: productDetail.id, userId: profile?.user?.id })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [])

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
            id='product-detail'
        >
            <section className='flex gap-10'>
                <div className='basis-2/5 max-w-[40%] grow-0 bg-[#FFFFFF] rounded-12 flex-shrink-0 w-[512px] h-[512px]'>
                    <Carousel className='w-full'>
                        <CarouselContent className=''>
                            {productDetail.productImages.length ? (
                                productDetail.productImages.map((image, idx) => (
                                    <CarouselItem key={idx}>
                                        <img
                                            src={image.url}
                                            className='object-cover w-full h-full rounded-8 overflow-hidden max-w-[512px] max-h-[512px]'
                                        />
                                    </CarouselItem>
                                ))
                            ) : (
                                <CarouselItem key={new Date().toISOString()}>
                                    <img
                                        src={productDetail.image}
                                        className='object-cover w-full h-full rounded-8 overflow-hidden max-w-[512px] max-h-[512px]'
                                    />
                                </CarouselItem>
                            )}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div className='space-y-3'>
                    {productSale && (
                        <Flex className='space-x-3'>
                            <h3 className='font-semibold font-mono text-xl bg-gradient-to-tr to-[#fcb045] via-[#fd1d1d] from-[#833ab4] bg-clip-text text-transparent'>
                                Sản phẩm đang giảm giá
                            </h3>
                            <Countdown />
                        </Flex>
                    )}
                    <h3 className='font-semibold text-2xl'>{productDetail.name}</h3>
                    <Link to={`/store/${storeDetail.id}`} className='inline-block'>
                        <Flex align={'center'} gapX={'4'}>
                            <Avatar fallback='A' src={storeDetail.image} />
                            <Text color='gray'>{storeDetail.name}</Text>
                        </Flex>
                    </Link>
                    <InputNumber
                        quantity={quantity}
                        setQuantity={setQuantity}
                        max={productSale ? productSale.currentQuantity : productDetail?.currentQuantity}
                    />
                    {productSale ? (
                        <div className='space-x-3 text-2xl flex items-center'>
                            <Text
                                size={'7'}
                                className='bg-gradient-to-tr to-[#fcb045] via-[#fd1d1d] from-[#833ab4] bg-clip-text text-transparent'
                            >
                                {convertCurrentcy(productSale.priceAfter || 0)}
                            </Text>
                            <Text
                                size={'7'}
                                className={classNames('line-through text-gray-400', {
                                    hidden: !productDetail.priceBefore
                                })}
                            >
                                {convertCurrentcy(productDetail.priceAfter || 0)}
                            </Text>
                        </div>
                    ) : (
                        <div className='space-x-3 text-2xl'>
                            <Text size={'7'} className='text-red-600'>
                                {convertCurrentcy(productDetail.priceAfter || 0, 0)}
                            </Text>
                            <Text
                                size={'7'}
                                className={classNames('line-through text-gray-400', {
                                    hidden: !productDetail.priceBefore
                                })}
                            >
                                {convertCurrentcy(productDetail.priceBefore || 0, 0)}
                            </Text>
                        </div>
                    )}
                    <div className='flex justify-start gap-3'>
                        <Button color='red' size={'3'} onClick={handleCheckout}>
                            Mua ngay
                        </Button>
                        <Button size={'3'} onClick={handleAddToCart(false)}>
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
            </section>
            <div className='flex gap-4'>
                <RatingList storeId={storeDetail.id} />
                <ProductRecomend />
            </div>
        </motion.div>
    )
}

export default Product
