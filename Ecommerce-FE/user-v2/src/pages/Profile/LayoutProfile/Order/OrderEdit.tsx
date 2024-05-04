import { AlertDialog, Button, Flex } from '@radix-ui/themes'

type OrderEditProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderEdit = ({ isOpen, setIsOpen }: OrderEditProps) => {
    return (
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialog.Content maxWidth='600px' className='!rounded-8'>
                <AlertDialog.Title>Cập nhật thông tin đơn hàng</AlertDialog.Title>
                <Flex gap='3' mt='4' justify='end'>
                    <AlertDialog.Cancel>
                        <Button variant='soft' color='red'>
                            Hủy
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button>Lưu thay đổi</Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderEdit
