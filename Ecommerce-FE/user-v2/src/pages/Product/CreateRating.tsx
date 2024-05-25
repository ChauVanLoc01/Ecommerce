import { AlertDialog, Button, Flex } from '@radix-ui/themes'

const CreateRating = () => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger>
                <Button variant='soft'>Đánh giá sản phẩm</Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                <AlertDialog.Title>Đánh giá sản phẩm</AlertDialog.Title>
                <Flex gapX='3' mt='5' justify='end'>
                    <AlertDialog.Cancel>
                        <Button type='button' variant='outline' color='red'>
                            Trở về
                        </Button>
                    </AlertDialog.Cancel>
                    <Button type='submit' className='bg-blue text-white'>
                        Xác nhận
                    </Button>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default CreateRating
