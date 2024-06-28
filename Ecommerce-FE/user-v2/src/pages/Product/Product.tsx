import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'

import { Avatar, Flex, Text } from '@radix-ui/themes'
import { Query, useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { useContext, useEffect, useState } from 'react'
import { Link, ScrollRestoration, useLoaderData, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { productFetching } from 'src/apis/product'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { route } from 'src/constants/route'
import { AppContext } from 'src/contexts/AppContext'
import { ProductDetailResponse, ProductListResponse } from 'src/types/product.type'
import { Store } from 'src/types/store.type'
import { ls } from 'src/utils/localStorage'
import { convertCurrentcy } from 'src/utils/utils.ts'
import ProductRecomend from './ProductRecomend'
import Rating from './Rating'

const Product = () => {
    const { setProducts, products, profile } = useContext(AppContext)
    const [quantity, setQuantity] = useState<number>(1)
    const [productDetail, _, storeDetail] = useLoaderData() as [ProductDetailResponse, ProductListResponse, Store]
    const navigate = useNavigate()

    const { mutate: createViewProduct } = useMutation({
        mutationFn: productFetching.createViewProduct
    })

    const { mutate: createViewAddToCart } = useMutation({
        mutationFn: productFetching.createViewAddToCart
    })

    // const [query, setQuery] = useState<Partial<Rating>>({ createdAt: 'desc' })

    // const { refetch, ratingsData } = useQuery({
    //     queryKey: ['ratings', JSON.stringify(query)],
    //     queryFn: ({ signal }) =>
    //         RatingApi.getProductRating({ productId: '', storeId: '' , limit: 1, page: 1 }),
    //     enabled: true,
    //     staleTime: 1000 * 60 * 5
    // })

    const handleAddToCart = (checked: boolean) => () => {
        if (!profile) {
            toast.error('Cần đăng nhập trước khi thực hiện mua hàng')
        } else {
            var isNewProductInStoreExist = true
            var productsTmp = products
            var storeExist = productsTmp.products[productDetail.storeId]
            if (!storeExist) {
                productsTmp = {
                    length: productsTmp.length + 1,
                    products: {
                        ...productsTmp.products,
                        [productDetail.storeId]: [
                            {
                                productId: productDetail.id,
                                buy: quantity,
                                name: productDetail.name,
                                image: productDetail.image,
                                priceAfter: productDetail.priceAfter,
                                checked
                            }
                        ]
                    }
                }
            } else {
                storeExist = storeExist.map((productInLS) => {
                    if (productDetail.id === productInLS.productId) {
                        isNewProductInStoreExist = false
                        return {
                            ...productInLS,
                            buy: productInLS.buy + quantity
                        }
                    }
                    return productInLS
                })
                if (isNewProductInStoreExist)
                    storeExist.push({
                        buy: quantity,
                        productId: productDetail.id,
                        image: productDetail.image,
                        name: productDetail.name,
                        priceAfter: productDetail.priceAfter,
                        checked
                    })
                productsTmp = {
                    ...productsTmp,
                    length: isNewProductInStoreExist ? productsTmp.length + 1 : productsTmp.length,
                    products: {
                        ...productsTmp.products,
                        [productDetail.storeId]: storeExist
                    }
                }
            }
            ls.deleteItem('products')
            ls.setItem('products', JSON.stringify(productsTmp))
            setProducts(productsTmp)
            toast.info('Thêm sản phẩm thành công')
            createViewAddToCart({ productId: productDetail.id, quantity })
        }
    }

    const handleCheckout = () => {
        handleAddToCart(true)()
        navigate(`/${route.checkout}`)
    }

    useEffect(() => {
        createViewProduct({ productId: productDetail.id, userId: profile?.user?.id })
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
                    {/* <Stars rating={3} /> */}
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
                        currentQuantity={productDetail.currentQuantity}
                    />
                    <div className='space-x-3 text-2xl'>
                        <span className='text-red-600'>{convertCurrentcy(productDetail.priceAfter || 0, 0)}</span>
                        <span
                            className={classNames('line-through text-gray-400', {
                                hidden: !productDetail.priceBefore
                            })}
                        >
                            {convertCurrentcy(productDetail.priceBefore || 0, 0)}
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
                <Rating />
                <ProductRecomend />
            </div>
        </motion.div>
    )
}

export default Product
