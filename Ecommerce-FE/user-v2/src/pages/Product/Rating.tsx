import { Flex, Spinner, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useLoaderData } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import { RatingApi } from 'src/apis/rating.api'
import { ProductDetailResponse } from 'src/types/product.type'
import CreateRating from './CreateRating'
import Review from './Review'

const Rating = () => {
    const [{ id: productId }, ,] = useLoaderData() as [ProductDetailResponse, any, any]

    const { isPending: isRatingPending, data: ratingsData } = useQuery({
        queryKey: ['ratingList', productId],
        queryFn: () => RatingApi.getAllRating({ productId }),
        staleTime: 1000 * 60 * 2,
        select: (data) => data.data.result
    })

    const { data: isCanCreate } = useQuery({
        queryKey: ['isCanCreateRating', productId],
        queryFn: () => RatingApi.canCreateRating(productId),
        staleTime: Infinity,
        select: (data) => data.data.result
    })

    return (
        <section className='bg-[#FFFFFF] rounded-12 border border-border/30 p-[24px] basis-2/3 space-y-4 sticky top-0'>
            {isRatingPending ? (
                <Spinner />
            ) : (
                <>
                    <div className='rounded-12 border border-border/30 p-[24px] flex'>
                        {ratingsData?.data.length ? (
                            <div className='basis-1/3 space-y-2'>
                                <div className='space-x-2 text-2xl relative'>
                                    <span className='font-semibold'>4</span>
                                    <span className='text-lg absolute top-1/2 -translate-y-1/2 text-gray-500'>/5</span>
                                </div>
                                <h3 className='tracking-wide'>Dựa trên 13 đánh giá</h3>
                                {/* <Stars rating={4} /> */}
                            </div>
                        ) : (
                            <Flex justify={'between'} className='w-full'>
                                <Text size={'4'}>Chưa có đánh giá</Text>
                                {isCanCreate !== false && <CreateRating />}
                            </Flex>
                        )}
                    </div>
                    <SimpleBar style={{ maxHeight: 708 }}>
                        {ratingsData?.data.length ? (
                            <div className='space-y-4'>
                                {ratingsData?.data.map((rating) => <Review data={rating} />)}
                            </div>
                        ) : (
                            <Flex justify={'center'} align={'center'} className='!py-28'>
                                <img
                                    className='w-36 object-cover'
                                    src='https://cdn-icons-png.flaticon.com/512/13982/13982785.png'
                                    alt='empty'
                                    loading='lazy'
                                />
                            </Flex>
                        )}
                    </SimpleBar>
                </>
            )}
        </section>
    )
}

export default Rating
