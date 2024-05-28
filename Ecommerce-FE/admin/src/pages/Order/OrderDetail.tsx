import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import { Order } from 'src/types/order.type'

type OrderDetailProps = {
    data: Order
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderDetail = ({ open, setOpen }: OrderDetailProps) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                <AlertDialog.Title>Thông tin chi tiết nhân viên</AlertDialog.Title>
                <Flex gap='3' mt='4' justify='end'>
                    <AlertDialog.Cancel>
                        <Button variant='outline' color='blue'>
                            Trở về
                        </Button>
                    </AlertDialog.Cancel>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderDetail
