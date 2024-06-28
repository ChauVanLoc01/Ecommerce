import { AlertDialog, Box, Button, Flex, Spinner, Text, TextArea } from '@radix-ui/themes'
import { useRef } from 'react'
import MultiUploadFile from 'src/components/MultiUploadFile/MultiUploadFile'
import Rating from 'src/components/Rating/Rating'
import { RatingBody } from 'src/types/rating.type'

type OrderRatingProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRatingData: React.Dispatch<React.SetStateAction<RatingBody>>
    isPending: boolean
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
    hanldeCreateRating: () => void
}

function OrderRating({
    isOpen,
    setIsOpen,
    isPending,
    setRatingData,
    files,
    setFiles,
    hanldeCreateRating
}: OrderRatingProps) {
    const focusoutEventRef = useRef<() => void>()

    const handleRating = (stars: number) => {
        setRatingData((pre) => ({ ...pre, stars }))
    }

    const handleChangeComment = (comment: string) => () => setRatingData((pre) => ({ ...pre, comment }))

    const debounceComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (focusoutEventRef?.current) {
            document.removeEventListener('focusout', focusoutEventRef.current)
        }
        focusoutEventRef.current = handleChangeComment(e.target.value)
        document.addEventListener('focusout', focusoutEventRef.current)
    }

    return (
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialog.Content maxWidth='700px' className='!rounded-8'>
                <form>
                    <div className='space-y-5'>
                        <AlertDialog.Title>Đánh giá đơn hàng</AlertDialog.Title>

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

                        <Flex direction='column' className='space-y-1'>
                            <Text as='p'>Đánh giá</Text>
                            <Flex direction={'row'} width='100%'>
                                <Rating handleRating={handleRating} />
                            </Flex>
                        </Flex>

                        <Flex direction='column' gap='3'>
                            <Text as='p'>Nhận xét (Bắt buộc)</Text>
                            <Box maxWidth='100%'>
                                <TextArea onChange={debounceComment} size='3' rows={5} placeholder='Nhận xét' />
                            </Box>
                        </Flex>
                        <Flex gap='3' mt='4' justify='end'>
                            <AlertDialog.Cancel>
                                <Button type='button' variant='solid' color='red'>
                                    Trở về
                                </Button>
                            </AlertDialog.Cancel>
                            <Button onClick={hanldeCreateRating} variant='solid' color='green' type='button'>
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
