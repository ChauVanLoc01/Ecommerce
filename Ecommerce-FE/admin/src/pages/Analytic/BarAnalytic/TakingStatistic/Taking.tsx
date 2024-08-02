import { Box, DataList, Flex, IconButton, Skeleton, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { maxBy, sumBy } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, LabelList, Rectangle, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticApi } from 'src/apis/analytics.api'
import AnalyticSelect from 'src/components/AnalyticState/AnalyticSelect'
import useAnalytic from 'src/hooks/useAnalytic'
import { convertCurrentcy } from 'src/utils/utils'

const labels = {
    total: 'Tổng',
    total_pay: 'Lợi nhuận',
    discount: 'Giảm giá'
}

const TakingStatistic = () => {
    const { type, setType } = useAnalytic()
    const widthRef = useRef<null | HTMLDivElement>(null)
    const [size, setSize] = useState<number>(300)

    const { data: takings, refetch: takingRefetch } = useQuery({
        queryKey: ['taking_analytics'],
        queryFn: AnalyticApi.takingAnalytics(type),
        staleTime: 1000 * 60 * 60 * 3,
        select: (res) => {
            let data = res.data.result
            let datas = data.data.map<{
                total_pay: number
                count: number
                date: string
                total: number
                discount: number
            }>((item, idx) => {
                return {
                    total: sumBy(item, (e) => e.total),
                    discount: sumBy(item, (e) => e.discount),
                    total_pay: sumBy(item, (e) => e?.pay),
                    count: item.length,
                    date: format(data.times[idx].start, 'dd/MM')
                }
            })
            let max = maxBy(datas, (item) => item?.total_pay)?.total_pay
            let today = datas[datas.length - 1].total_pay
            let percent = max ? (today * 100) / max : 100
            return {
                list: datas,
                percent
            }
        }
    })

    useEffect(() => {
        takingRefetch()
    }, [type])

    useEffect(() => {
        if (widthRef?.current) {
            setSize(widthRef.current?.clientWidth)
        }
    }, [widthRef])

    return (
        <div className='bg-white p-[16px] rounded-8 border-border/20 border shadow-sm space-y-3' ref={widthRef}>
            <Flex justify={'between'} align={'center'}>
                <Flex align={'center'} gapX={'4'}>
                    <IconButton variant='soft'>
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke-width='1.5'
                            stroke='currentColor'
                            className='w-5 h-5 stroke-2'
                        >
                            <path
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                d='M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z'
                            />
                        </svg>
                    </IconButton>
                    <Text weight={'medium'} size={'4'}>
                        Doanh Thu
                    </Text>
                </Flex>
                <AnalyticSelect setAnalyticType={setType} />
            </Flex>
            {takings && takings?.list?.length ? (
                <>
                    <Flex gapX={'5'}>
                        <Flex gapX={'3'}>
                            <Text className='font-bold'>Tổng:</Text>
                            <Text>{convertCurrentcy(takings.list[takings.list.length - 1].total)}</Text>
                        </Flex>
                        <Flex gapX={'3'}>
                            <Text className='font-bold'>Giảm giá:</Text>
                            <Text>{convertCurrentcy(takings.list[takings.list.length - 1].discount)}</Text>
                        </Flex>
                        <Flex gapX={'3'}>
                            <Text className='font-bold'>Lợi nhuận:</Text>
                            <Text>{convertCurrentcy(takings.list[takings.list.length - 1].total_pay)}</Text>
                        </Flex>
                    </Flex>
                    <Flex className='rounded-8 bg-gray-100 p-12 w-full' gapX={'5'} justify={'between'}>
                        <BarChart
                            width={size}
                            height={150}
                            margin={{ top: 20, left: 10, right: 10 }}
                            data={takings.list}
                            className='flex-shrink-0 w-full h-full'
                        >
                            <YAxis allowDataOverflow />
                            <XAxis dataKey='date' />
                            <Tooltip
                                allowEscapeViewBox={{ x: true, y: true }}
                                content={({ payload }) => {
                                    return (
                                        <div className='bg-white rounded-6 shadow-md p-4 border border-gray-200'>
                                            <DataList.Root>
                                                {payload?.map((item) => (
                                                    <DataList.Item align='center'>
                                                        <DataList.Label className='font-bold'>
                                                            {labels?.[item.dataKey as keyof typeof labels]}
                                                        </DataList.Label>
                                                        <DataList.Value className='font-bold'>
                                                            {convertCurrentcy(item?.value as number)}
                                                        </DataList.Value>
                                                    </DataList.Item>
                                                ))}
                                            </DataList.Root>
                                        </div>
                                    )
                                }}
                            />
                            <Bar dataKey={'total_pay'} fill='#1677ff' barSize={30} shape={<Rectangle radius={6} />}>
                                <LabelList dataKey='total_pay' position='top' />
                            </Bar>
                        </BarChart>
                    </Flex>
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

export default TakingStatistic
