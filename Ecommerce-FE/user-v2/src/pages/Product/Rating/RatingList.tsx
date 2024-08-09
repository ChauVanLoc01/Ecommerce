import { Box, Flex, Progress, Skeleton, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { RatingApi } from 'src/apis/rating.api'
import RatingContainer from './RatingContainer'
import { calcPercentRating } from 'src/utils/utils.ts'

type RatingListProps = {
    storeId: string
}

const RatingList = ({ storeId }: RatingListProps) => {
    const params = useParams()
    const productId = params.productId?.split('-0-')[1]
    const [page, setPage] = useState<number>(0)

    const { data: ratingList } = useQuery({
        queryKey: ['ratings', { productId, page }],
        queryFn: RatingApi.getProductRating({ productId: productId as string, storeId, page }),
        select: (data) => data.data.result,
        staleTime: Infinity
    })

    if (!ratingList) {
        return (
            <section className='bg-[#FFFFFF] rounded-12 border border-border/30 p-[24px] basis-2/3 sticky top-0 space-y-4'>
                <Flex justify={'between'} width={'100%'} gap={'1'}>
                    <Flex direction={'column'} justify={'start'} align={'start'} gapY={'3'}>
                        <Text size={'6'}>Đánh giá sản phẩm</Text>
                    </Flex>
                </Flex>
                <div className='space-y-5'>
                    {Array(3)
                        .fill(0)
                        .map((_, idx) => (
                            <div
                                key={`rating_${idx}`}
                                className='user-comment flex flex-col w-full h-full flex-start space-y-2'
                            >
                                <Flex gap='3' align='center'>
                                    <Skeleton>
                                        <Box width={'45px'} height={'45px'} className='rounded-full' />
                                    </Skeleton>
                                    <div className='space-y-2'>
                                        <Skeleton>
                                            <Box width={'100px'} height={'18px'} />
                                        </Skeleton>
                                        <Skeleton>
                                            <Box width={'100px'} height={'12px'} />
                                        </Skeleton>
                                    </div>
                                </Flex>
                                <Skeleton className='w-full h-20 rounded-8' />
                            </div>
                        ))}
                </div>
            </section>
        )
    }

    if (Object.prototype.toString.call(ratingList).includes('Array') && !(ratingList as unknown as any[]).length) {
        return (
            <section className='bg-[#FFFFFF] rounded-12 border border-border/30 p-[24px] basis-2/3 sticky top-0 space-y-4'>
                <div>
                    <Flex direction={'column'} justify={'start'} align={'start'} gapY={'3'}>
                        <Text size={'6'}>Đánh giá sản phẩm</Text>
                    </Flex>
                    <Flex justify={'center'} align={'center'} direction={'column'} className='space-y-5 py-36'>
                        <img
                            src='https://cdn-icons-png.flaticon.com/512/4076/4076566.png'
                            alt='empy-rating'
                            className='w-32 h-32'
                        />
                        <Text size={'4'}>Chưa có đánh giá cho sản phẩm này</Text>
                    </Flex>
                </div>
            </section>
        )
    }

    return (
        <section className='bg-[#FFFFFF] rounded-12 border border-border/30 p-[24px] basis-2/3 sticky top-0 space-y-4'>
            <Flex justify={'between'} width={'100%'} gap={'1'}>
                <Flex direction={'column'} justify={'start'} align={'start'} gapY={'3'}>
                    <Text size={'6'}>Đánh giá sản phẩm</Text>
                    {/* <Flex align={'center'} gapX={'2'}>
                        <Text size={'2'}>Tỉ lệ đánh giá:</Text>
                        <Text size={'2'}>{ratingList.data.summary.average}⭐</Text>
                    </Flex>
                    <Flex align={'center'} gapX={'2'}>
                        <Text size={'2'}>Số lượt nhận xét:</Text>
                        <Text size={'2'}>{ratingList.data.summary.total}</Text>
                    </Flex> */}
                </Flex>
                {/* <div className='basis-1/3 flex-shrink-1'>
                    <Flex align={'center'} className='space-x-2'>
                        <Text size={'2'}>5⭐</Text>
                        <Progress
                            value={calcPercentRating(ratingList.data.summary.total, ratingList.data.summary.five)}
                        />
                    </Flex>
                    <Flex align={'center'} className='space-x-2'>
                        <Text size={'2'}>4⭐</Text>
                        <Progress
                            value={calcPercentRating(ratingList.data.summary.total, ratingList.data.summary.four)}
                        />
                    </Flex>
                    <Flex align={'center'} className='space-x-2'>
                        <Text size={'2'}>3⭐</Text>
                        <Progress
                            value={calcPercentRating(ratingList.data.summary.total, ratingList.data.summary.three)}
                        />
                    </Flex>
                    <Flex align={'center'} className='space-x-2'>
                        <Text size={'2'}>2⭐</Text>
                        <Progress
                            value={calcPercentRating(ratingList.data.summary.total, ratingList.data.summary.two)}
                        />
                    </Flex>
                    <Flex align={'center'} className='space-x-2'>
                        <Text size={'2'}>1⭐</Text>
                        <Progress
                            value={calcPercentRating(ratingList.data.summary.total, ratingList.data.summary.one)}
                        />
                    </Flex>
                </div> */}
            </Flex>
            <div className='space-y-5'>
                {ratingList.data.ratings.map((rating) => (
                    <RatingContainer key={rating.id} rating={rating} />
                ))}
            </div>
        </section>
    )
}

export default RatingList
