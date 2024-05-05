import { AlertDialog, Button, Flex, Spinner } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { OrderFetching } from 'src/apis/order'
import { OrderResponse } from 'src/types/order.type'
import { Return } from 'src/types/return.type'

type OrderCancelProps = {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    orderId: string
    refetch: (
        options?: RefetchOptions
    ) => Promise<QueryObserverResult<AxiosResponse<Return<OrderResponse>, any>, Error>>
}

const OrderCancel = ({ isOpen, setIsOpen, orderId, refetch }: OrderCancelProps) => {
    const { mutate, isPending } = useMutation({
        mutationFn: OrderFetching.cancelOrder,
        onSuccess: () => {
            toast.success('Hủy đơn hàng thành công')
            refetch()
            setTimeout(() => {
                setIsOpen(false)
            }, 1000)
        },
        onError: () => {
            toast.error('Hủy đơn hàng không thành công')
        }
    })

    const handleCancelOrder = () => mutate(orderId)

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
                    <Button onClick={handleCancelOrder}>{isPending && <Spinner />} Xác nhận hủy</Button>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default OrderCancel
