import { Button, Flex, Spinner, TextArea } from '@radix-ui/themes'
import { useState } from 'react'
import { OrderFlowEnum, OrderNextFlowLable } from 'src/constants/order.status'
import { OrderRefund } from 'src/types/order.type'

type Props = {
    id: number
    new_flow: OrderFlowEnum
    updateStatusOfOrder: (id: number, status: OrderFlowEnum, note: string, orderRefundId?: string) => () => void
    updating: {
        id?: number
        isUpdating: boolean
    }
    orderRefunds: OrderRefund[]
}

const OrderFlowForm = ({ new_flow, updateStatusOfOrder, updating, id, orderRefunds }: Props) => {
    const [note, setNote] = useState<string>('')

    const handleChangeNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNote(e.target.value)

    return (
        <div className='space-y-2'>
            <h3>{OrderNextFlowLable[new_flow]}?</h3>
            <TextArea
                value={note}
                onChange={handleChangeNote}
                placeholder='Ghi chú cho đơn hàng'
                autoComplete='none'
                translate='no'
            />
            <Flex justify={'end'}>
                <Button
                    type='button'
                    onClick={updateStatusOfOrder(id, new_flow, note, orderRefunds[orderRefunds.length - 1]?.id || '')}
                >
                    {updating.id === id && updating.isUpdating && <Spinner />}
                    Xác nhận
                </Button>
            </Flex>
        </div>
    )
}

export default OrderFlowForm
