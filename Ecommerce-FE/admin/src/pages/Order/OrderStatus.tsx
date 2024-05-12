import { CheckIcon, QuestionMarkIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex, IconButton, Spinner, Text } from '@radix-ui/themes'
import { format } from 'date-fns'
import { useState } from 'react'
import { OrderFlow } from 'src/types/order.type'
import OrderConfirmStatus from './OrderConfirmStatus'
import { OrderStatusWithoutColor } from 'src/constants/order.status'

type OrderStatusProps = {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: OrderFlow[]
    handleFetchAll: () => Promise<[any]>
    orderId: string
}

const OrderStatus = ({ open, setOpen, data, handleFetchAll, orderId }: OrderStatusProps) => {
    const [openWaitingConfirm, setOpenWaitingConfirm] = useState<boolean>(false)
    const [openDelivery, setOpenDelivery] = useState<boolean>(false)

    return (
        <>
            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Content maxWidth='750px' className='!rounded-8'>
                    <AlertDialog.Title>Trạng thái đơn hàng</AlertDialog.Title>
                    <AlertDialog.Description size='2'>
                        Trạng thái đơn hàng không thể khôi phục sau khi xác nhận cập nhật. Vui lòng xem xét kĩ trước khi
                        quyết định
                    </AlertDialog.Description>
                    <Flex gapX={'5'} justify={'between'} mt={'5'}>
                        <Flex gapX={'2'} align={'center'}>
                            <OrderConfirmStatus
                                orderId={orderId}
                                nextStatus={OrderStatusWithoutColor.SHIPING}
                                open={openWaitingConfirm}
                                setIsOpen={setOpenWaitingConfirm}
                                triggerNode={
                                    <IconButton
                                        className='text-blue_hover bg-blue/10'
                                        size={'2'}
                                        onClick={() => setOpenWaitingConfirm(true)}
                                        disabled={data.length > 1}
                                    >
                                        {data.length === 1 ? <Spinner /> : <CheckIcon />}
                                    </IconButton>
                                }
                                handleFetchAll={handleFetchAll}
                            />
                            <Flex direction={'column'}>
                                <Text>Chờ xác nhận</Text>
                                {data[0] && (
                                    <Text size={'2'} color='gray'>
                                        {format(data[0].createdAt, 'hh:mm dd-MM-yyyy')}
                                    </Text>
                                )}
                            </Flex>
                        </Flex>
                        <Flex gapX={'2'} align={'center'}>
                            <OrderConfirmStatus
                                orderId={orderId}
                                nextStatus={OrderStatusWithoutColor.SUCCESS}
                                triggerNode={
                                    <IconButton
                                        className='text-blue_hover bg-blue/10'
                                        onClick={() => setOpenDelivery(true)}
                                        disabled={data.length !== 2}
                                    >
                                        {data.length === 2 ? (
                                            <Spinner />
                                        ) : data.length < 2 ? (
                                            <QuestionMarkIcon />
                                        ) : (
                                            <CheckIcon />
                                        )}
                                    </IconButton>
                                }
                                open={openDelivery}
                                setIsOpen={setOpenDelivery}
                                handleFetchAll={handleFetchAll}
                            />
                            <Flex direction={'column'}>
                                <Text>Đang giao hàng</Text>
                                {data[1] && (
                                    <Text size={'2'} color='gray'>
                                        {format(data[1].createdAt, 'hh:mm dd-MM-yyyy')}
                                    </Text>
                                )}
                            </Flex>
                        </Flex>
                        <Flex gapX={'2'} align={'center'}>
                            <IconButton disabled={true} className='text-blue_hover bg-blue/10'>
                                {data.length === 3 ? <CheckIcon /> : <QuestionMarkIcon />}
                            </IconButton>
                            <Flex direction={'column'}>
                                <Text>Giao hàng thành công</Text>
                                {data[2] && (
                                    <Text size={'2'} color='gray'>
                                        {format(data[2].createdAt, 'hh:mm dd-MM-yyyy')}
                                    </Text>
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
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
