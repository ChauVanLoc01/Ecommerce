import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import { OrderFlowEnum } from 'src/constants/order.status'
import { OrderDetailResponse } from 'src/types/order.type'
import OrderFlow from './components/OrderFlow'

type OrderStatusProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    handleFetchAll: () => Promise<[any]>
    orderDetailData: OrderDetailResponse
    updateStatusOfOrder: (id: number, status: OrderFlowEnum, note?: string, orderRefundId?: string) => () => void
    updating: {
        id?: number
        isUpdating: boolean
    }
}

const OrderStatus = ({
    open,
    setOpen,
    handleFetchAll,
    orderDetailData,
    updateStatusOfOrder,
    updating
}: OrderStatusProps) => {
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
                            updating={updating}
                            orderFlows={orderDetailData.OrderFlow.sort(
                                (a, b) => (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any)
                            )}
                            updateStatusOfOrder={updateStatusOfOrder}
                            orderRefunds={orderDetailData.OrderRefund.filter(
                                (refund) => refund.status !== OrderFlowEnum.CANCEL_REFUND
                            ).sort((a, b) => (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any))}
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
