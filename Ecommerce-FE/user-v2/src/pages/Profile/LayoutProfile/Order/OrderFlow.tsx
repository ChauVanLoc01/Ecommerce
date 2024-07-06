import { compareAsc, format, milliseconds, millisecondsToSeconds } from 'date-fns'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import { defaultFormat } from 'src/constants/date-format'
import SimpleScrollbar from 'simplebar-react'
import { Flex, Spinner, Text } from '@radix-ui/themes'
import { OrderDetailResponse } from 'src/types/order.type'
import { OrderFlowEnum, OrderFlowLable } from 'src/constants/order-status'
import { cn } from 'src/utils/utils.ts'

type OrderFlowProps = {
    dataListRef: React.MutableRefObject<HTMLDListElement | null>
    orderFlow: OrderDetailResponse['OrderFlow']
}

const OrderFlow = ({ dataListRef, orderFlow }: OrderFlowProps) => {
    if (!dataListRef) {
        return (
            <Flex className='py-5'>
                <Spinner />
            </Flex>
        )
    }

    console.log('orderFLow', orderFlow)

    return (
        <SimpleScrollbar style={{ maxHeight: `${dataListRef.current?.clientHeight}px` }} forceVisible={false}>
            {orderFlow
                .sort((a, b) => (new Date(a.createdAt) as any) - (new Date(b.createdAt) as any))
                .map((flow, idx) => (
                    <VerticalTimeline layout='1-column-left' lineColor='#7BB2DE' className='!py-2 !pr-5 !space-y-4'>
                        <VerticalTimelineElement
                            className='vertical-timeline-element--work !mb-0'
                            position='right'
                            contentStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                            contentArrowStyle={{ borderRight: '7px solid  #91A4D0' }}
                            date={format(flow.createdAt, defaultFormat)}
                            dateClassName='!pb-0 text-[#FBF9F9]'
                            iconStyle={{ background: '#91A4D0', color: '#FBF9F9' }}
                            iconClassName={cn(
                                '!size-4 !translate-x-1/2 !translate-y-1/2 !flex justify-center items-center',
                                {
                                    '!animate-pulse':
                                        orderFlow.length === idx + 1 && orderFlow[idx].status !== OrderFlowEnum.FINISH
                                }
                            )}
                        >
                            <h3>{OrderFlowLable[flow.status as keyof typeof OrderFlowLable]}</h3>
                        </VerticalTimelineElement>
                    </VerticalTimeline>
                ))}
        </SimpleScrollbar>
    )
}

export default OrderFlow
