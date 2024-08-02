import { Box, DataList, Flex, IconButton, Skeleton, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, LabelList, Rectangle, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticApi } from 'src/apis/analytics.api'
import AnalyticSelect from 'src/components/AnalyticState/AnalyticSelect'
import { OrderFlowEnum } from 'src/constants/order.status'
import useAnalytic from 'src/hooks/useAnalytic'
import { convertCurrentcy } from 'src/utils/utils'

const OrderStatistic = () => {
    const { type, setType } = useAnalytic()
    const widthRef = useRef<null | HTMLDivElement>(null)
    const [size, setSize] = useState<number>(300)
    const { data: takings, refetch: takingRefetch } = useQuery({
        queryKey: ['order_analytics'],
        queryFn: AnalyticApi.orderAnalytics(type),
        staleTime: 1000 * 60 * 60 * 3,
        select: (result) => {
            let data = result.data.result
            return {
                list: data.data.map((item, idx) => ({
                    count: item.length,
                    date: format(data.times[idx].start, 'dd/MM'),
                    waiting: item.filter((e) => e.status === OrderFlowEnum.WAITING_CONFIRM).length,
                    shipping: item.filter((e) => e.status === OrderFlowEnum.CONFIRM_AND_SHIPPING).length,
                    finish: item.filter((e) => e.status === OrderFlowEnum.FINISH).length
                }))
            }
        }
    })
    useEffect(() => {
        if (widthRef?.current) {
            setSize(widthRef.current?.clientWidth)
        }
    }, [widthRef])

    useEffect(() => {
        takingRefetch()
    }, [type])

    return (
        <div className='bg-white p-[16px] rounded-8 border-border/20 border shadow-sm space-y-3' ref={widthRef}>
            <Flex justify={'between'} align={'center'}>
                <Flex align={'center'} gapX={'4'}>
                    <IconButton variant='soft'>
                        <svg
                            className='w-5 h-5 stroke-2'
                            viewBox='0 0 15 15'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M3 2.5C3 2.22386 3.22386 2 3.5 2H9.08579C9.21839 2 9.34557 2.05268 9.43934 2.14645L11.8536 4.56066C11.9473 4.65443 12 4.78161 12 4.91421V12.5C12 12.7761 11.7761 13 11.5 13H3.5C3.22386 13 3 12.7761 3 12.5V2.5ZM3.5 1C2.67157 1 2 1.67157 2 2.5V12.5C2 13.3284 2.67157 14 3.5 14H11.5C12.3284 14 13 13.3284 13 12.5V4.91421C13 4.51639 12.842 4.13486 12.5607 3.85355L10.1464 1.43934C9.86514 1.15804 9.48361 1 9.08579 1H3.5ZM4.5 4C4.22386 4 4 4.22386 4 4.5C4 4.77614 4.22386 5 4.5 5H7.5C7.77614 5 8 4.77614 8 4.5C8 4.22386 7.77614 4 7.5 4H4.5ZM4.5 7C4.22386 7 4 7.22386 4 7.5C4 7.77614 4.22386 8 4.5 8H10.5C10.7761 8 11 7.77614 11 7.5C11 7.22386 10.7761 7 10.5 7H4.5ZM4.5 10C4.22386 10 4 10.2239 4 10.5C4 10.7761 4.22386 11 4.5 11H10.5C10.7761 11 11 10.7761 11 10.5C11 10.2239 10.7761 10 10.5 10H4.5Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    </IconButton>
                    <Text weight={'medium'} size={'4'}>
                        Đơn Hàng
                    </Text>
                </Flex>
                <AnalyticSelect setAnalyticType={setType} />
            </Flex>
            {takings && takings?.list?.length ? (
                <>
                    <Flex gapX={'5'} wrap='wrap'>
                        <Flex gapX={'3'}>
                            <Text className='font-bold'>Tổng:</Text>
                            <Text>{convertCurrentcy(takings.list[takings.list.length - 1].count, false)}</Text>
                        </Flex>
                        <Flex gapX={'3'}>
                            <Text className='font-bold'>Chờ xác nhận:</Text>
                            <Text>{convertCurrentcy(takings.list[takings.list.length - 1].waiting, false)}</Text>
                        </Flex>
                        <Flex gapX={'3'}>
                            <Text className='font-bold'>Đang giao hàng:</Text>
                            <Text>{convertCurrentcy(takings.list[takings.list.length - 1].shipping, false)}</Text>
                        </Flex>
                    </Flex>
                    <div className='rounded-8 bg-gray-100 p-12 w-full'>
                        <BarChart
                            margin={{ top: 20, left: 10, right: 10 }}
                            width={size}
                            height={150}
                            data={takings.list}
                            className='flex-shrink-0 w-full h-full'
                        >
                            <YAxis allowDataOverflow />
                            <XAxis dataKey='date' />
                            <Tooltip
                                allowEscapeViewBox={{ x: true, y: true }}
                                content={({ payload }) => {
                                    let item = payload?.[0]
                                    return (
                                        <div className='bg-white rounded-6 shadow-md p-4 border border-gray-200'>
                                            <DataList.Root>
                                                <DataList.Item align='center'>
                                                    <DataList.Label className='font-bold'>Tổng</DataList.Label>
                                                    <DataList.Value className='font-bold'>
                                                        {convertCurrentcy(item?.payload?.count as number, false)}
                                                    </DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item align='center'>
                                                    <DataList.Label className='font-bold'>Chờ xác nhận</DataList.Label>
                                                    <DataList.Value className='font-bold'>
                                                        {convertCurrentcy(item?.payload?.waiting as number, false)}
                                                    </DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item align='center'>
                                                    <DataList.Label className='font-bold'>
                                                        Đang giao hàng
                                                    </DataList.Label>
                                                    <DataList.Value className='font-bold'>
                                                        {convertCurrentcy(item?.payload?.shipping as number, false)}
                                                    </DataList.Value>
                                                </DataList.Item>
                                            </DataList.Root>
                                        </div>
                                    )
                                }}
                            />
                            <Bar dataKey={'count'} fill='#ff4d4f' barSize={30} shape={<Rectangle radius={6} />}>
                                <LabelList dataKey='count' position='top' />
                            </Bar>
                        </BarChart>
                    </div>
                </>
            ) : (
                <div className='flex flex-col justify-between space-y-2'>
                    <Flex gapX={'3'}>
                        <Skeleton>
                            <Box width={'100px'} height={'30px'} />
                        </Skeleton>
                        <Skeleton>
                            <Box width={'100px'} height={'30px'} />
                        </Skeleton>
                        <Skeleton>
                            <Box width={'100px'} height={'30px'} />
                        </Skeleton>
                    </Flex>
                    <Skeleton>
                        <Box width={`${size - 40}px`} height={'150px'} />
                    </Skeleton>
                </div>
            )}
        </div>
    )
}

export default OrderStatistic
