import { AlertDialog, Box, Button, Flex, Spinner, Text, TextArea } from '@radix-ui/themes'
import { format } from 'date-fns'
import MultiUploadFile from 'src/components/MultiUploadFile/MultiUploadFile'
import RatingReadOnly from 'src/components/Rating/RatingReadOnly'
import { formatDefault } from 'src/constants/date.constants'
import { RatingTableType } from 'src/types/rating.type'

type ReplyRatingCreateProps = {
    rating: RatingTableType
    user: { full_name: string; email: string; image: string; id: string }
    openReplyRating: boolean
    setOpenReplyRating: React.Dispatch<React.SetStateAction<boolean>>
    handleComment: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    isCreating: boolean
    files: {
        files: Map<number, File>
        primary?: number
    }
    setFiles: React.Dispatch<
        React.SetStateAction<{
            files: Map<number, File>
            primary?: number
        }>
    >
    setUserId: React.Dispatch<React.SetStateAction<string>>
    onCreateReplyRating: () => void
}

function ReplyRatingCreate({
    openReplyRating,
    setOpenReplyRating,
    handleComment,
    files,
    setFiles,
    isCreating,
    setUserId,
    rating,
    user,
    onCreateReplyRating
}: ReplyRatingCreateProps) {
    return (
        <AlertDialog.Root open={openReplyRating} onOpenChange={setOpenReplyRating}>
            <AlertDialog.Content maxWidth='900px' className='!rounded-8'>
                <form>
                    <div className='space-y-5'>
                        <AlertDialog.Title>Phản hồi đánh giá</AlertDialog.Title>

                        <Flex direction='column' gap='3'>
                            <div
                                id={user.full_name}
                                className='user-rating flex flex-row w-full h-full items-center gap-3'
                            >
                                <p className='text-base font-bold'>{user.full_name}</p>
                                <p className='text-sm font-bold'>{user.email}</p>
                                <RatingReadOnly ratingValue={rating.stars} />
                                <p>{format(rating.createdAt, formatDefault)}</p>
                            </div>
                            <div className='user-comment flex flex-col w-full h-full flex-start gap-5'>
                                <div className='flex flex-col w-full h-full items-start gap-3 px-5 py-3 border-2 border-gray-300 rounded-md'>
                                    <p className='text-md'>{rating.comment}</p>
                                </div>
                            </div>
                        </Flex>
                        <Flex direction='column' gap='3'>
                            <Text as='p'>Phản hồi khách hàng (có thể để trống)</Text>
                            <Box maxWidth='100%'>
                                <TextArea onChange={handleComment} size='3' placeholder='Nhận xét' />
                            </Box>
                            <MultiUploadFile files={files} setFiles={setFiles} min={0} cols={5}>
                                {(total, current, min) => (
                                    <Flex className='space-x-1 mt-2'>
                                        <Text>Đã tải lên</Text>
                                        <Flex>
                                            (<Text color={current < min ? 'red' : 'blue'}>{current}</Text>/{total})
                                        </Flex>
                                    </Flex>
                                )}
                            </MultiUploadFile>
                        </Flex>
                        <Flex gap='3' mt='4' justify='end'>
                            <AlertDialog.Cancel>
                                <Button type='button' className='bg-red text-white' onClick={() => setUserId('')}>
                                    Trở về
                                </Button>
                            </AlertDialog.Cancel>
                            <Button type='button' onClick={onCreateReplyRating} className='bg-blue text-white'>
                                {isCreating && <Spinner />}
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
