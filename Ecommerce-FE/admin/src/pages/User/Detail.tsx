import { Button, Dialog, Flex } from '@radix-ui/themes'

type Props = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Detail = ({ open, setOpen }: Props) => {
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Content maxWidth='600px' className='rounded-8'>
                <Dialog.Title>Cập nhật trạng thái cửa hàng</Dialog.Title>
                <Dialog.Description size='2' mb='4'>
                    Cửa hàng này sẽ không thể tiếp tục bán hàng trên nền tảng của bạn nửa? Bạn có chắc muốn làm điều
                    này?
                </Dialog.Description>

                <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                        <Button variant='soft' color='gray' type='button'>
                            Trở về
                        </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button>Cập nhật</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default Detail
