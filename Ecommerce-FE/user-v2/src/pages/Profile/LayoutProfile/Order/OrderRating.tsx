import { AlertDialog, Box, Button, Flex, Spinner, Text, TextArea } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import { RatingApi } from 'src/apis/rating.api'
import Rating from 'src/components/Rating/Rating'
import { OrderResponse } from 'src/types/order.type'
import { RatingBody } from 'src/types/rating.type'
import { Reject, Return } from 'src/types/return.type'

type OrderRatingProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    ratingData: RatingBody
    refetch: (
        options?: RefetchOptions | undefined
    ) => Promise<QueryObserverResult<AxiosResponse<Return<OrderResponse>, any>, Error>>
}

function OrderRating({ isOpen, setIsOpen, ratingData, refetch }: OrderRatingProps) {
    const [ratingValue, setRatingValue] = useState(ratingData?.stars)
    const [commentValue, setCommentValue] = useState(ratingData?.comment)

    const handleRating = (rateNum: number) => {
        setRatingValue(rateNum)
        ratingData.stars = rateNum
    }
    const handleComment = (e: any) => {
        setCommentValue(e.target.value)
        ratingData.comment = commentValue
    }

    //xử lý api
    const { mutate, isSuccess, isPending } = useMutation({
        mutationFn: (body: RatingBody) => RatingApi.createNewRating(body),

        onSuccess: (result) => {
            refetch()
            toast.success('Đánh giá thành công')
            setIsOpen(false)
        },
        onError: (error) => {
            if (axios.isAxiosError<Reject>(error) && error.response?.status === 401) {
                toast.error(error.response.data.message)
            }
        }
    })

    const onSubmit = () => {
        setRatingValue(0)
        setCommentValue('')
        mutate(ratingData)
    }

    if (!ratingData) {
        return (
            <AlertDialog.Root>
                <AlertDialog.Content>
                    <AlertDialog.Title>Đánh giá đơn hàng</AlertDialog.Title>
                    <Spinner />
                </AlertDialog.Content>
            </AlertDialog.Root>
        )
    }

    return (
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialog.Content maxWidth='900px' className='!rounded-8'>
                <form>
                    <div className='space-y-5'>
                        <AlertDialog.Title>Đánh giá đơn hàng</AlertDialog.Title>
                        <Flex justify='center' direction='row'>
                            {/* set initial value */}
                            {/* <StarRating /> */}
                        </Flex>

                        <Flex direction='column' gap='3'>
                            <Text as='p'>Đánh giá</Text>
                            <Flex direction={'row'} gap='3' width='100%'>
                                <Rating rating={ratingValue} setRating={handleRating} />
                            </Flex>
                        </Flex>

                        <Flex direction='column' gap='3'>
                            <Text as='p'>Nhận xét (có thể để trống)</Text>
                            <Box maxWidth='100%'>
                                <TextArea onInput={handleComment} size='3' placeholder='Nhận xét' />
                            </Box>
                        </Flex>

                        <Flex gap='3' mt='4' justify='end'>
                            <AlertDialog.Cancel>
                                <Button type='button' variant='solid' color='red'>
                                    Trở về
                                </Button>
                            </AlertDialog.Cancel>
                            <Button onClick={onSubmit} variant='solid' color='green' type='button'>
                                {isPending && <Spinner />}
                                Lưu đánh giá
                            </Button>
                        </Flex>
                    </div>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderRating
