import { Button, Flex, Popover, Spinner, Text } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { toast } from 'sonner'
import { OrderApi } from 'src/apis/order.api'
import { OrderStatusWithoutColor } from 'src/constants/order.status'

type OrderConfirmStatusProps = {
    open: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    nextStatus?: string
    triggerNode: ReactNode
    handleFetchAll: () => Promise<[any]>
    orderId: string
}

const OrderConfirmStatus = ({
    open,
    setIsOpen,
    nextStatus,
    triggerNode,
    handleFetchAll,
    orderId
}: OrderConfirmStatusProps) => {
    const { isPending, mutate } = useMutation({
        mutationFn: OrderApi.updateStatusOrder,
        onSuccess: () => {
            handleFetchAll()
            setIsOpen(false)
            toast.success('Cập nhật trạng thái đơn hàng thành công')
        },
        onError: () => {
            toast.error('Lỗi! Cập nhật trạng thái đơn hàng không thành công')
        }
    })

    const onSubmit = () => mutate({ orderId, status: nextStatus as string })

    return (
        <Popover.Root open={open} onOpenChange={setIsOpen}>
            <Popover.Trigger>{triggerNode}</Popover.Trigger>
            <Popover.Content width='350px' className='!rounded-8'>
                <Flex direction={'column'} gapY={'2'}>
                    <Text size={'3'} weight={'bold'}>
                        {nextStatus ? 'Xác nhận hoàn thành bước này?' : 'Xác nhận hoàn thành đơn hàng?'}
                    </Text>
                    {nextStatus === OrderStatusWithoutColor.SHIPING ? (
                        <Text size={'2'}>Trạng thái tiếp theo là: Đang giao hàng</Text>
                    ) : (
                        <Text size={'2'}>Giao hàng thành công, kết thúc đơn hàng</Text>
                    )}
                    <Flex gap='3' mt='3' justify='end'>
                        <Popover.Close>
                            <Button variant='outline' color='red' type='button'>
                                Hủy
                            </Button>
                        </Popover.Close>
                        <Button type='submit' className='bg-blue text-white' onClick={onSubmit}>
                            {isPending && <Spinner />}
                            Xác nhận
                        </Button>
                    </Flex>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}

export default OrderConfirmStatus
