import { Box, Flex, IconButton, Skeleton, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticApi } from 'src/apis/analytics.api'
import AnalyticSelect from 'src/components/AnalyticState/AnalyticSelect'
import useAnalytic from 'src/hooks/useAnalytic'

const CustomerStatistic = () => {
    const { type, setType } = useAnalytic()
    const widthRef = useRef<null | HTMLDivElement>(null)
    const [size, setSize] = useState<number>(300)

    const { data: customerRating, refetch: customerRefetch } = useQuery({
        queryKey: ['customer_rating_analytics'],
        queryFn: AnalyticApi.customerRating(type),
        staleTime: 1000 * 60 * 60 * 3,
        select: (result) => result.data
    })

    useEffect(() => {
        if (widthRef?.current) {
            setSize(widthRef.current?.clientWidth)
        }
    }, [widthRef])

    useEffect(() => {
        customerRefetch()
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
                                d='M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82708 7.49972C1.82708 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82708 10.6327 1.82708 7.49972ZM5.03747 9.21395C4.87949 8.98746 4.56782 8.93193 4.34133 9.08991C4.11484 9.24789 4.05931 9.55956 4.21729 9.78605C4.93926 10.8211 6.14033 11.5 7.50004 11.5C8.85974 11.5 10.0608 10.8211 10.7828 9.78605C10.9408 9.55956 10.8852 9.24789 10.6587 9.08991C10.4323 8.93193 10.1206 8.98746 9.9626 9.21395C9.41963 9.99238 8.51907 10.5 7.50004 10.5C6.481 10.5 5.58044 9.99238 5.03747 9.21395ZM5.37503 6.84998C5.85828 6.84998 6.25003 6.45815 6.25003 5.97498C6.25003 5.4918 5.85828 5.09998 5.37503 5.09998C4.89179 5.09998 4.50003 5.4918 4.50003 5.97498C4.50003 6.45815 4.89179 6.84998 5.37503 6.84998ZM10.5 5.97498C10.5 6.45815 10.1083 6.84998 9.62503 6.84998C9.14179 6.84998 8.75003 6.45815 8.75003 5.97498C8.75003 5.4918 9.14179 5.09998 9.62503 5.09998C10.1083 5.09998 10.5 5.4918 10.5 5.97498Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    </IconButton>
                    <Text weight={'medium'} size={'4'}>
                        Tỉ lệ khách hàng quay lại
                    </Text>
                </Flex>
                <AnalyticSelect setAnalyticType={setType} />
            </Flex>
            <Flex className='rounded-8 bg-gray-100 p-12 w-full' justify={'between'}>
                {customerRating ? (
                    <LineChart
                        width={730}
                        height={250}
                        data={customerRating?.data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray='3 3' />
                        <XAxis dataKey='date' />
                        <YAxis />
                        <Tooltip
                            allowEscapeViewBox={{ x: true, y: true }}
                            content={({ payload }) => {
                                let value = +(payload?.[0]?.value || 0)
                                let percent = Math.round(value)
                                let count = payload?.[0]?.payload?.order?.length
                                return (
                                    <div className='bg-white rounded-6 shadow-md p-4 border border-gray-200'>
                                        <Flex gapX={'3'}>
                                            <Text className='font-bold'>Tỉ lệ:</Text>
                                            <Text>{`${percent}`}%</Text>
                                        </Flex>
                                        <Flex gapX={'3'}>
                                            <Text className='font-bold'>Tổng khách hàng:</Text>
                                            <Text>{count}</Text>
                                        </Flex>
                                    </div>
                                )
                            }}
                        />
                        <Line type='monotone' dataKey='percent' stroke='#8884d8' />
                    </LineChart>
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
            </Flex>
        </div>
    )
}

export default CustomerStatistic
