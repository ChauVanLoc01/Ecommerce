import { AlertDialog, Button, Flex } from '@radix-ui/themes'

type OrderCancelProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderCancel = ({ isOpen, setIsOpen }: OrderCancelProps) => {
    return (
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                <AlertDialog.Title>Hủy đơn hàng</AlertDialog.Title>
                <AlertDialog.Description size='2'>
                    Bạn vẫn có thể mua lại đơn hàng sau khi đã hủy
                </AlertDialog.Description>
                <Flex gap='3' mt='4' justify='end'>
                    <AlertDialog.Cancel>
                        <Button variant='soft' color='red'>
                            Trở về
                        </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                        <Button>Xác nhận hủy</Button>
                    </AlertDialog.Action>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderCancel
