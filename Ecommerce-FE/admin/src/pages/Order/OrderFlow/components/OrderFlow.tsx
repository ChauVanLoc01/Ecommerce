import { format } from 'date-fns'
import { FaQuestion } from 'react-icons/fa6'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import SimpleScrollbar from 'simplebar-react'
import { formatDefault } from 'src/constants/date.constants'
import { order_next_flow, OrderFlowEnum, OrderFlowLable } from 'src/constants/order.status'
import { OrderFlow as OrderFlowType, OrderRefund } from 'src/types/order.type'
import { cn } from 'src/utils/utils'
import OrderFlowForm from './OrderFlowForm'
import { Text, TextArea } from '@radix-ui/themes'

type OrderFlowProps = {
    orderFlows: OrderFlowType[]
    orderRefunds: OrderRefund[]
    updateStatusOfOrder: (id: number, status: OrderFlowEnum, note?: string, orderRefundId?: string) => () => void
    updating: {
        id?: number
        isUpdating: boolean
    }
}

const OrderFlow = ({ orderFlows, updateStatusOfOrder, orderRefunds, updating }: OrderFlowProps) => {
    return (
        <SimpleScrollbar style={{ maxHeight: `450px`, width: '100%' }} forceVisible={false}>
            <VerticalTimeline layout='1-column-left' lineColor='#7BB2DE' className='!py-2 !pr-5 !space-y-4'>
                {orderFlows.map((flow, idx) => {
                    let isLast = orderFlows.length === idx + 1
                    return (
                        <VerticalTimelineElement
                            key={flow.id}
                            className='vertical-timeline-element--work !mb-0'
                            position='right'
                            contentStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                            contentArrowStyle={{ borderRight: '7px solid  #91A4D0' }}
                            dateClassName='!pb-0 text-[#FBF9F9]'
                            date={format(flow.createdAt, formatDefault)}
                            iconStyle={{
                                background: isLast ? '#DE5B18' : '#91A4D0'
                            }}
                            iconClassName={cn(
                                '!size-4 !translate-x-1/2 !translate-y-1/2 !flex justify-center items-center'
                            )}
                        >
                            <h3>{OrderFlowLable[flow.status as keyof typeof OrderFlowLable]}</h3>
                            <div>
                                <Text>Ghi Chú</Text>
                                <TextArea value={flow?.note} autoComplete='none' translate='no' disabled />
                            </div>
                        </VerticalTimelineElement>
                    )
                })}
                {order_next_flow?.[orderFlows[orderFlows.length - 1].status as keyof typeof order_next_flow] &&
                    order_next_flow[orderFlows[orderFlows.length - 1].status as keyof typeof order_next_flow].map(
                        (new_flow, id) => (
                            <VerticalTimelineElement
                                key={new_flow}
                                className='vertical-timeline-element--work !mb-0'
                                position='right'
                                contentStyle={{ background: '#2989C3', color: '#FAF9FA' }}
                                contentArrowStyle={{ borderRight: '7px solid  #2989C3' }}
                                dateClassName='!pb-0 text-[#FAF9FA]'
                                iconStyle={{ background: 'white' }}
                                iconClassName={cn(
                                    '!size-4 !translate-x-1/2 !translate-y-1/2 !flex justify-center items-center'
                                )}
                                icon={<FaQuestion />}
                            >
                                <OrderFlowForm
                                    key={`next_flow_${id}`}
                                    id={id}
                                    new_flow={new_flow}
                                    orderRefunds={orderRefunds}
                                    updateStatusOfOrder={updateStatusOfOrder}
                                    updating={updating}
                                />
                            </VerticalTimelineElement>
                        )
                    )}
            </VerticalTimeline>
        </SimpleScrollbar>
    )
}

export default OrderFlow
