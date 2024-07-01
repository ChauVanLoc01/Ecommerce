import { Avatar, Box, Flex, Spinner, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { RatingApi } from 'src/apis/rating.api'
import { dateFormat } from 'src/constants/date-format'
import { DataRatingListResponse, Rating as RatingType } from 'src/types/rating.type'

// const RatingChild = () => {

//     return <div className='flex flex-col gap-5'>
//     <div
//         id={reply.replyRatingId}
//         className='admin-reply flex flex-row w-full h-full items-center gap-3'
//     >
//         <img
//             src={reply.userAvtURL}
//             className='rounded-full w-10 h-10'
//         />
//         <p className='text-base font-bold'>{reply.userName}</p>
//     </div>
//     <div className='reply-comment flex flex-col w-full h-full flex-start gap-5'>
//         <p className='time text-sm text-gray-900'>
//             Lúc {reply.replyRatingTime.toLocaleString('vi-VN')} đã trả
//             lời
//         </p>
//         <div className='flex flex-col w-full h-full items-start gap-3 px-5 py-3 border-2 border-gray-300 rounded-sm'>
//             <p className='text-md'>{reply.replyRatingComment}</p>
//         </div>
//     </div>
// </div>
// }

type StarProps = {
    count: number
}

const Star = ({ count }: StarProps) => {
    let starWhite = Array(5)
        .fill(0)
        .map((_) => <span>★</span>)

    let starYellow = Array(5)
        .fill(0)
        .map((_) => <span className='text-yellow-500'>★</span>)

    return <>{[...starYellow, ...starWhite].slice(5 - count, -count)}</>
}

type RatingParentProps = {
    data: RatingType
    userName: string
    imgUrl?: string
    stars: number
    materials: DataRatingListResponse['data']['ratingMaterial'][string]
}

const RatingParent = ({ data, userName, imgUrl, stars, materials }: RatingParentProps) => {
    console.log('material', materials)
    return (
        <>
            <Flex gap='3' align='center'>
                <Avatar size='3' src={imgUrl} radius='full' fallback='T' />
                <Box>
                    <Text as='div' size='2' weight='bold'>
                        {userName}
                    </Text>
                </Box>
            </Flex>
            <div className='user-comment flex flex-col w-full h-full flex-start space-y-3'>
                <div className='mt-2'>
                    <Star count={stars} />
                    <Text className='ml-2 time text-sm text-gray-900'>
                        Nhận xét lúc {format(data.createdAt, dateFormat)}
                    </Text>
                </div>
                <Flex>
                    {/* {materials.map(({ url }) => (
                        <div>
                            <img src={url} alt='image' />
                        </div>
                    ))} */}
                </Flex>
                <div className='flex flex-col w-full h-full items-start gap-3 px-5 py-3 border-2 border-gray-300 rounded-md'>
                    <Text className='text-md'>{data.comment}</Text>
                </div>
            </div>
        </>
    )
}

type RatingListProps = {
    ratings: DataRatingListResponse['data']
    usernames: Record<string, { full_name: string; image: string }>
}

const RatingList = ({ ratings, usernames }: RatingListProps) => {
    return (
        <div className='space-y-4'>
            {ratings.ratings.map((rating) => (
                <div>
                    <RatingParent
                        data={rating}
                        userName={usernames[rating.createdBy].full_name}
                        imgUrl={usernames[rating.createdBy].image}
                        stars={rating.stars}
                        materials={ratings.ratingMaterial[rating.id]}
                    />
                </div>
            ))}
        </div>
    )
}

type RatingProps = {
    storeId: string
}

const Rating = ({ storeId }: RatingProps) => {
    const params = useParams()
    const productId = params.productId?.split('-0-')[1]
    const [page, setPage] = useState<number>(0)

    const { data: ratingData } = useQuery({
        queryKey: ['ratings', { productId, page }],
        queryFn: RatingApi.getProductRating({ productId: productId as string, storeId, page }),
        select: (data) => data.data.result,
        staleTime: 1000 * 60 * 2
    })

    if (!ratingData) {
        return (
            <Flex justify={'center'} className='h-48 flex-grow'>
                <Spinner />
            </Flex>
        )
    }

    const isResultArr = Object.prototype.toString.call(ratingData).includes('Array')

    return (
        <section className='bg-[#FFFFFF] rounded-12 border border-border/30 p-[24px] basis-2/3 space-y-4 sticky top-0'>
            <>
                <Flex direction={'column'} width={'100%'} gap={'1'}>
                    <Flex direction={'column'} justify={'start'} align={'start'} gapY={'3'}>
                        <Text size={'6'}>Nhận xét</Text>
                        <Text size={'2'}>
                            Số lượt nhận xét:{' '}
                            {isResultArr ? 0 : (ratingData as DataRatingListResponse).data.summary.total}
                        </Text>
                    </Flex>
                </Flex>
                {isResultArr ? (
                    <Flex justify={'center'} align={'center'} className='!py-28'>
                        <img
                            className='w-36 object-cover'
                            src='https://cdn-icons-png.flaticon.com/512/13982/13982785.png'
                            alt='empty'
                            loading='lazy'
                        />
                    </Flex>
                ) : (
                    <RatingList
                        ratings={(ratingData as DataRatingListResponse).data}
                        usernames={(ratingData as DataRatingListResponse).data.userNames}
                        materials={(ratingData as DataRatingListResponse).data.ratingMaterial}
                    />
                )}
            </>
        </section>
    )
}

export default Rating
