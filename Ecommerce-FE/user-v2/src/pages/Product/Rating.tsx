import { Flex, Text } from '@radix-ui/themes'
import { useLoaderData } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import RatingReadOnly from 'src/components/Rating/RatingReadOnly'
import { ProductDetailResponse } from 'src/types/product.type'
import { IsCreateRatingResponse } from 'src/types/rating.type'
import CreateRating from './CreateRating'
import { OrderQuery } from 'src/types/order.type'
import { useState } from 'react'

const Rating = () => {
    type RatingReply = {
        parentRatingId: string
        replyRatingId: string
        userId: string
        userName: string
        userAvtURL: string
        replyRatingTime: Date
        replyRatingComment: string
    }

    type RatingData = {
        ratingId: string
        userId: string
        username: string
        ratingTime: Date
        ratingValue: number
        ratingComment: string
        userAvtURL: string
        listReviewImg: string[]
        reply: RatingReply[]
    }

    type TotalRatingData = {
        productId: string
        storeId: string
        ratingValue: number
        numOfRating: number
    }

    const [query, setQuery] = useState<Partial<OrderQuery>>({ createdAt: 'desc' })

    const [{ id: productId }, , , isCanCreateRating] = useLoaderData() as [
        ProductDetailResponse,
        any,
        any,
        boolean | IsCreateRatingResponse
    ]

    const ratingData: { totalRatingData: TotalRatingData; detailRatingData: RatingData[] } = {
        totalRatingData: {
            productId: '123',
            storeId: '012',
            ratingValue: 4,
            numOfRating: 2
        },
        detailRatingData: [
            {
                ratingId: '1',
                userId: '123',
                username: 'User 1',
                ratingTime: new Date('1/1/2024'),
                ratingValue: 4,
                ratingComment: 'Sản phẩm dùng rất tốt',
                userAvtURL: 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png',
                listReviewImg: [
                    'https://photo2.tinhte.vn/data/attachment-files/2022/12/6242141_image.jpg',
                    'https://photo2.tinhte.vn/data/attachment-files/2022/12/6242141_image.jpg',
                    'https://photo2.tinhte.vn/data/attachment-files/2022/12/6242141_image.jpg'
                ],
                reply: []
            },
            {
                ratingId: '2',
                userId: '124',
                username: 'User 2',
                ratingTime: new Date('2/1/2024'),
                ratingValue: 5,
                ratingComment: 'Tuyệt vời',
                userAvtURL: 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png',
                listReviewImg: [
                    'https://photo2.tinhte.vn/data/attachment-files/2022/12/6242141_image.jpg',
                    'https://photo2.tinhte.vn/data/attachment-files/2022/12/6242141_image.jpg',
                    'https://photo2.tinhte.vn/data/attachment-files/2022/12/6242141_image.jpg'
                ],
                reply: [
                    {
                        parentRatingId: '2',
                        replyRatingId: '3',
                        userId: '012',
                        userName: 'Shop 1',
                        userAvtURL: 'https://i.pinimg.com/564x/59/7a/de/597ade7f979fdb7c06df948d599862bb.jpg',
                        replyRatingTime: new Date('2/1/2024'),
                        replyRatingComment: 'Sốp cảm ơn bạn'
                    }
                ]
            }
        ]
    }

    return (
        <section className='bg-[#FFFFFF] rounded-12 border border-border/30 p-[24px] basis-2/3 space-y-4 sticky top-0'>
            <>
                <Flex direction={'column'} width={'100%'} gap={'1'}>
                    <Flex direction={'column'} justify={'start'} align={'start'} gapY={'3'}>
                        <Text size={'6'}>Nhận xét</Text>
                        <Text size={'2'}>Số lượt nhận xét: {ratingData.totalRatingData.numOfRating}</Text>
                    </Flex>
                </Flex>
                {ratingData.totalRatingData && ratingData.detailRatingData.length != 0 ? (
                    <Flex direction={'column'} ml={'2'} width={'100%'} gap={'5'}>
                        {ratingData.detailRatingData.map((rating: RatingData) => {
                            return (
                                <Flex direction={'column'} width={'100%'} gap={'4'}>
                                    <div
                                        id={rating.ratingId}
                                        className='user-rating flex flex-row w-full h-full items-center gap-3'
                                    >
                                        <img src={rating.userAvtURL} className='rounded-full w-10 h-10' />
                                        <p className='text-base font-bold'>{rating.username}</p>
                                        <RatingReadOnly ratingValue={rating.ratingValue} />
                                    </div>
                                    <div className='user-comment flex flex-col w-full h-full flex-start gap-5'>
                                        <p className='time text-sm text-gray-900'>
                                            Lúc {rating.ratingTime.toLocaleString('vi-VN')} đã viết
                                        </p>
                                        <div className='flex flex-col w-full h-full items-start gap-3 px-5 py-3 border-2 border-gray-300 rounded-md'>
                                            <p className='text-md'>{rating.ratingComment}</p>
                                        </div>
                                    </div>
                                    <div className='review-img-list flex flex-row w-full items-center justify-start gap-2'>
                                        {rating.listReviewImg &&
                                            rating.listReviewImg.length > 0 &&
                                            rating.listReviewImg.map((reviewImg: string) => (
                                                <div className='img-container flex w-40 h-40 border-2 border-gray-300 rounded-md'>
                                                    <img src={reviewImg} alt='' sizes='' className='flex rounded-sm' />
                                                </div>
                                            ))}
                                    </div>

                                    <div className='ml-12 reply'>
                                        {rating.reply &&
                                            rating.reply.length > 0 &&
                                            rating.reply.map((reply: RatingReply) => (
                                                <div className='flex flex-col gap-5'>
                                                    <div
                                                        id={reply.replyRatingId}
                                                        className='admin-reply flex flex-row w-full h-full items-center gap-3'
                                                    >
                                                        <img
                                                            src={reply.userAvtURL}
                                                            className='rounded-full w-10 h-10'
                                                        />
                                                        <p className='text-base font-bold'>{reply.userName}</p>
                                                    </div>
                                                    <div className='reply-comment flex flex-col w-full h-full flex-start gap-5'>
                                                        <p className='time text-sm text-gray-900'>
                                                            Lúc {reply.replyRatingTime.toLocaleString('vi-VN')} đã trả
                                                            lời
                                                        </p>
                                                        <div className='flex flex-col w-full h-full items-start gap-3 px-5 py-3 border-2 border-gray-300 rounded-sm'>
                                                            <p className='text-md'>{reply.replyRatingComment}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </Flex>
                            )
                        })}
                    </Flex>
                ) : (
                    <Flex justify={'between'} className='w-full'>
                        <Text size={'4'}>Chưa có đánh giá</Text>
                        {isCanCreateRating !== false && <CreateRating />}
                        <SimpleBar style={{ maxHeight: 708 }}>
                            {ratingData?.detailRatingData.length == 0 ? (
                                <Flex justify={'center'} align={'center'} className='!py-28'>
                                    <img
                                        className='w-36 object-cover'
                                        src='https://cdn-icons-png.flaticon.com/512/13982/13982785.png'
                                        alt='empty'
                                        loading='lazy'
                                    />
                                </Flex>
                            ) : (
                                ''
                            )}
                        </SimpleBar>
                    </Flex>
                )}
            </>
        </section>
    )
}

export default Rating
