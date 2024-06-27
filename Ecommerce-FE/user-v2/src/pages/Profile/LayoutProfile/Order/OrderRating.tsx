import { AlertDialog, Box, Button, Flex, Spinner, Text, TextArea } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import { RatingApi } from 'src/apis/rating.api'
import Rating from 'src/components/Rating/Rating'
import { RatingBody } from 'src/types/rating.type'
import { Reject } from 'src/types/return.type'

type OrderRatingProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    ratingData: RatingBody
}

function OrderRating({ isOpen, setIsOpen, ratingData }: OrderRatingProps) {
    console.log('ratingData', ratingData)

    const [ratingValue, setRatingValue] = useState(ratingData?.rating)
    const [commentValue, setCommentValue] = useState(ratingData?.comment)

    const handleRating = (rateNum: number) => {
        setRatingValue(rateNum)
        if (ratingData && ratingData.rating) ratingData.rating = rateNum
    }
    const handleComment = (e: any) => {
        setCommentValue(e.target.value)
        if (ratingData && ratingData.comment) ratingData.comment = commentValue
    }

    //xử lý api
    const { mutate, isSuccess, isPending } = useMutation({
        mutationFn: (body: RatingBody) => RatingApi.createNewRating(body),
        onSuccess: (result) => {
            toast.success('Đánh giá thành công')
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
        console.log('ratingValue', ratingValue)
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
                            <AlertDialog.Action>
                                <Button onClick={onSubmit} variant='solid' color='green' type='submit'>
                                    Lưu đánh giá
                                </Button>
                            </AlertDialog.Action>
                        </Flex>
                    </div>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderRating
