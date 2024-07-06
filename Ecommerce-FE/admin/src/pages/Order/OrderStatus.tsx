import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import { useState } from 'react'
import { OrderFlow as OrderFlowType } from 'src/types/order.type'
import OrderFlow from './OrderFlow'

type OrderStatusProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: OrderFlowType[]
    handleFetchAll: () => Promise<[any]>
    orderId: string
}

const OrderStatus = ({ open, setOpen, data, handleFetchAll, orderId }: OrderStatusProps) => {
    const [openWaitingConfirm, setOpenWaitingConfirm] = useState<boolean>(false)
    const [openDelivery, setOpenDelivery] = useState<boolean>(false)

    return (
        <>
            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Content maxWidth='600px' className='!rounded-8'>
                    <AlertDialog.Title>Trạng thái đơn hàng</AlertDialog.Title>
                    <AlertDialog.Description size='2'>
                        Trạng thái đơn hàng không thể khôi phục sau khi xác nhận cập nhật. Vui lòng xem xét kĩ trước khi
                        quyết định
                    </AlertDialog.Description>
                    <div className='mt-5'>
                        <OrderFlow
                            orderFlows={data.sort(
                                (a, b) => (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any)
                            )}
                        />
                    </div>
                    <Flex gap='3' mt='7' justify='end'>
                        <AlertDialog.Cancel>
                            <Button type='submit' className='bg-blue text-white'>
                                Trở về
                            </Button>
                        </AlertDialog.Cancel>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
        </>
    )
}

export default OrderStatus
