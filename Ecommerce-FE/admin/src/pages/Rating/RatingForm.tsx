import { AlertDialog, Avatar, Box, Button, Flex, Spinner, Text, TextArea } from '@radix-ui/themes'
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
            <AlertDialog.Content maxWidth='700px' className='!rounded-8'>
                <form>
                    <div className='space-y-5'>
                        <AlertDialog.Title>Phản hồi đánh giá</AlertDialog.Title>
                        <Flex direction='column' gap='3'>
                            <Flex gap='3' align='center'>
                                <Avatar size='3' src={user.image} radius='full' fallback='T' />
                                <Box>
                                    <Text as='div' size='2' weight='bold'>
                                        {user.full_name}
                                    </Text>
                                    <Text as='div' size='2' color='gray'>
                                        {user.email}
                                    </Text>
                                </Box>
                            </Flex>
                            <Flex className='space-x-4 items-center'>
                                <RatingReadOnly ratingValue={rating.stars} />
                                <Text>{format(rating.createdAt, formatDefault)}</Text>
                            </Flex>
                            <TextArea disabled>{rating.comment}</TextArea>
                        </Flex>
                        <Flex direction='column' gap='3'>
                            <Text as='p'>Phản hồi khách hàng (có thể không cần phản hồi)</Text>
                            <Box maxWidth='100%'>
                                {
                                    [
                                        <TextArea
                                            onChange={handleComment}
                                            size='3'
                                            rows={4}
                                            placeholder='Thêm phản hồi'
                                        />,
                                        <TextArea
                                            disabled
                                            size='3'
                                            placeholder='Thêm phản hồi'
                                            defaultValue={rating.comment}
                                        />
                                    ][+rating.isReply]
                                }
                            </Box>
                        </Flex>
                        <Flex gap='3' mt='4' justify='end'>
                            <AlertDialog.Cancel>
                                <Button type='button' className='bg-red text-white' onClick={() => setUserId('')}>
                                    Trở về
                                </Button>
                            </AlertDialog.Cancel>
                            {!rating.isReply && (
                                <Button type='button' onClick={onCreateReplyRating} className='bg-blue text-white'>
                                    {isCreating && <Spinner />}
                                    Lưu Phản hồi
                                </Button>
                            )}
                        </Flex>
                    </div>
                </form>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default ReplyRatingCreate
