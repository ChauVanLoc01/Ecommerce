import { format } from 'date-fns'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import SimpleScrollbar from 'simplebar-react'
import { formatDefault } from 'src/constants/date.constants'
import { order_next_flow, OrderFlowEnum, OrderFlowLable } from 'src/constants/order.status'
import { OrderFlow as OrderFlowType } from 'src/types/order.type'
import { cn } from 'src/utils/utils'

type OrderFlowProps = {
    orderFlows: OrderFlowType[]
}

const OrderFlow = ({ orderFlows }: OrderFlowProps) => {
    return (
        <SimpleScrollbar style={{ maxHeight: `450px`, width: '100%' }} forceVisible={false}>
            <VerticalTimeline layout='1-column-left' lineColor='#7BB2DE' className='!py-2 !pr-5 !space-y-4'>
                {orderFlows.map((flow, idx) => (
                    <VerticalTimelineElement
                        className='vertical-timeline-element--work !mb-0'
                        position='right'
                        contentStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                        contentArrowStyle={{ borderRight: '7px solid  #91A4D0' }}
                        dateClassName='!pb-0 text-[#FBF9F9]'
                        date={format(flow.createdAt, formatDefault)}
                        iconStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                        iconClassName={cn(
                            '!size-4 !translate-x-1/2 !translate-y-1/2 !flex justify-center items-center',
                            {
                                '!animate-pulse':
                                    orderFlows.length === idx + 1 && orderFlows[idx].status !== OrderFlowEnum.FINISH
                            }
                        )}
                    >
                        <h3>{OrderFlowLable[flow.status as keyof typeof OrderFlowLable]}</h3>
                    </VerticalTimelineElement>
                ))}
                {order_next_flow?.[orderFlows[orderFlows.length - 1].status as keyof typeof order_next_flow] &&
                    order_next_flow[orderFlows[orderFlows.length - 1].status as keyof typeof order_next_flow].map(
                        (new_flow) => (
                            <VerticalTimelineElement
                                className='vertical-timeline-element--work !mb-0'
                                position='right'
                                contentStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                                contentArrowStyle={{ borderRight: '7px solid  #91A4D0' }}
                                dateClassName='!pb-0 text-[#FBF9F9]'
                                iconStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                                iconClassName={cn(
                                    '!size-4 !translate-x-1/2 !translate-y-1/2 !flex justify-center items-center'
                                )}
                            >
                                <h3>{OrderFlowLable[new_flow as keyof typeof OrderFlowLable]}</h3>
                            </VerticalTimelineElement>
                        )
                    )}
            </VerticalTimeline>
        </SimpleScrollbar>
    )
}

export default OrderFlow
