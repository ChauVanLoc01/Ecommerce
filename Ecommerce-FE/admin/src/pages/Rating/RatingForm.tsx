import { AlertDialog, Box, Button, Flex, Spinner, Text, TextArea } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import axios, { AxiosResponse } from 'axios'
import { useState } from 'react'
import { toast } from 'sonner'
import { RatingAPI } from 'src/apis/rating.api'
import MultiUploadFile from 'src/components/MultiUploadFile/MultiUploadFile'
import RatingReadOnly from 'src/components/Rating/RatingReadOnly'
import { RatingFromUser, RatingReplyBody } from 'src/types/rating.type'
import { Reject } from 'src/types/return.type'

type ReplyRatingCreateProps = {
    ratingFromUser: RatingFromUser
    openReplyRating: boolean
    setOpenReplyRating: React.Dispatch<React.SetStateAction<boolean>>

    // refetch: (
    //     options?: RefetchOptions | undefined
    // ) => Promise<QueryObserverResult<AxiosResponse<Return<RatingTableResponse>, any>, Error>>
}

function ReplyRatingCreate({ ratingFromUser, openReplyRating, setOpenReplyRating }: ReplyRatingCreateProps) {
    const [replyData, setReplyData] = useState<RatingReplyBody>({
        parentRatingId: ratingFromUser.ratingId,
        comment: '',
        urls: ['']
    })

    const [files, setFiles] = useState<{ files: Map<number, File>; primary?: number }>({ files: new Map() })

    const handleComment = (e: any) => {
        replyData.comment = e.target.value
        setReplyData(replyData)
    }

    //xử lý api
    const { mutate, isSuccess, isPending } = useMutation({
        mutationFn: (body: RatingReplyBody) => RatingAPI.replyRating(body),

        onSuccess: (result) => {
            // refetch()
            toast.success('Đánh giá thành công')
            setOpenReplyRating(false)
        },
        onError: (error) => {
            if (axios.isAxiosError<Reject>(error) && error.response?.status === 401) {
                toast.error(error.response.data.message)
            }
        }
    })

    const onSubmit = () => {
        mutate(replyData)
    }

    if (!ratingFromUser) {
        return (
            <AlertDialog.Root>
                <AlertDialog.Content>
                    <AlertDialog.Title>Phản hồi</AlertDialog.Title>
                    <Spinner />
                </AlertDialog.Content>
            </AlertDialog.Root>
        )
    }

    return (
        <AlertDialog.Root open={openReplyRating} onOpenChange={setOpenReplyRating}>
            <AlertDialog.Content maxWidth='900px' className='!rounded-8'>
                <form>
                    <div className='space-y-5'>
                        <AlertDialog.Title>Phản hồi đánh giá</AlertDialog.Title>

                        <Flex direction='column' gap='3'>
                            <div
                                id={ratingFromUser.username}
                                className='user-rating flex flex-row w-full h-full items-center gap-3'
                            >
                                <p className='text-base font-bold'>{ratingFromUser.username}</p>
                                <p className='text-sm font-bold'>{ratingFromUser.email}</p>
                                <RatingReadOnly ratingValue={ratingFromUser.stars} />
                                <p>Lúc {ratingFromUser.replyCreatedTime.toLocaleString('vi-VN')}</p>
                            </div>
                            <div className='user-comment flex flex-col w-full h-full flex-start gap-5'>
                                <div className='flex flex-col w-full h-full items-start gap-3 px-5 py-3 border-2 border-gray-300 rounded-md'>
                                    <p className='text-md'>{ratingFromUser.comment}</p>
                                </div>
                            </div>
                        </Flex>
                        <Flex direction='column' gap='3'>
                            <Text as='p'>Phản hồi khách hàng (có thể để trống)</Text>
                            <Box maxWidth='100%'>
                                <TextArea onInput={handleComment} size='3' placeholder='Nhận xét' />
                            </Box>
                            <MultiUploadFile files={files} setFiles={setFiles} min={1}>
                                {(total, current, min) => (
                                    <Flex className='space-x-1 mt-2'>
                                        <Text>Ít nhất {min} hình ảnh</Text>
                                        <Flex>
                                            (<Text color={current < min ? 'red' : 'blue'}>{current}</Text>/{total})
                                        </Flex>
                                    </Flex>
                                )}
                            </MultiUploadFile>
                        </Flex>
                        <Flex gap='3' mt='4' justify='end'>
                            <AlertDialog.Cancel>
                                <Button type='button' variant='solid' color='red'>
                                    Trở về
                                </Button>
                            </AlertDialog.Cancel>
                            <Button onClick={onSubmit} variant='solid' color='green' type='button'>
                                {isPending && <Spinner />}
                                Lưu Phản hồi
                            </Button>
                        </Flex>
                    </div>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default ReplyRatingCreate
