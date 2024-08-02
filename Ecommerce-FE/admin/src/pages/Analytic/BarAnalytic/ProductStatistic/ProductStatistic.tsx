import { Box, DataList, Flex, IconButton, Skeleton, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, LabelList, Rectangle, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticApi } from 'src/apis/analytics.api'
import AnalyticSelect from 'src/components/AnalyticState/AnalyticSelect'
import useAnalytic from 'src/hooks/useAnalytic'
import { convertCurrentcy } from 'src/utils/utils'

const ProductStatistic = () => {
    const { type, setType } = useAnalytic()
    const [size, setSize] = useState<number>(300)
    const widthRef = useRef<null | HTMLDivElement>(null)
    const { data: takings, refetch: takingRefetch } = useQuery({
        queryKey: ['count_view_analytics'],
        queryFn: AnalyticApi.countUserViewStore(type),
        staleTime: 1000 * 60 * 60 * 3,
        select: (result) => {
            return {
                list: result.data.result.map((item) => ({
                    ...item,
                    start: format(item.start, 'dd/MM'),
                    anymous: item.list.filter((e) => !e?.userId).length,
                    total: item.list.length
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
                                d='M3.30902 1C2.93025 1 2.58398 1.214 2.41459 1.55279L1.05279 4.27639C1.01807 4.34582 1 4.42238 1 4.5V13C1 13.5523 1.44772 14 2 14H13C13.5523 14 14 13.5523 14 13V4.5C14 4.42238 13.9819 4.34582 13.9472 4.27639L12.5854 1.55281C12.416 1.21403 12.0698 1.00003 11.691 1.00003L7.5 1.00001L3.30902 1ZM3.30902 2L7 2.00001V4H2.30902L3.30902 2ZM8 4V2.00002L11.691 2.00003L12.691 4H8ZM7.5 5H13V13H2V5H7.5ZM5.5 7C5.22386 7 5 7.22386 5 7.5C5 7.77614 5.22386 8 5.5 8H9.5C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7H5.5Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    </IconButton>
                    <Text weight={'medium'} size={'4'}>
                        Số lượt tiếp cận cửa hàng
                    </Text>
                </Flex>
                <AnalyticSelect setAnalyticType={setType} />
            </Flex>
            {takings && takings?.list?.length ? (
                <>
                    <Flex gapX={'5'} wrap='wrap'>
                        <Flex gapX={'3'}>
                            <Text className='font-bold'>Tổng:</Text>
                            <Text>{convertCurrentcy(takings?.list?.[takings.list.length - 1]?.total, false)}</Text>
                        </Flex>
                        <Flex gapX={'3'}>
                            <Text className='font-bold'>Ẩn danh:</Text>
                            <Text>{convertCurrentcy(takings?.list?.[takings.list.length - 1]?.anymous, false)}</Text>
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
                            <XAxis dataKey='start' />
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
                                                        {convertCurrentcy(item?.payload?.total as number, false)}
                                                    </DataList.Value>
                                                </DataList.Item>
                                                <DataList.Item align='center'>
                                                    <DataList.Label className='font-bold'>Ẩn danh</DataList.Label>
                                                    <DataList.Value className='font-bold'>
                                                        {convertCurrentcy(item?.payload?.anymous as number, false)}
                                                    </DataList.Value>
                                                </DataList.Item>
                                            </DataList.Root>
                                        </div>
                                    )
                                }}
                            />
                            <Bar dataKey={'total'} fill='#13c2c2' barSize={30} shape={<Rectangle radius={6} />}>
                                <LabelList dataKey='total' position='top' />
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

export default ProductStatistic
