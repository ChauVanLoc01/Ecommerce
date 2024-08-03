import { Avatar, Box, Card, Flex, Inset, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, LabelList, Rectangle, Tooltip, XAxis, YAxis } from 'recharts'
import { AnalyticApi } from 'src/apis/analytics.api'

const Top10Product = () => {
    const widthRef = useRef<null | HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(0)
    const { data: views } = useQuery({
        queryKey: ['top_10_view_product'],
        queryFn: AnalyticApi.top10ViewProduct,
        select: (result) => result.data
    })
    const data = [
        {
            name: 'Iphone 15',
            uv: 4000,
            pv: 4400
        },
        {
            name: 'Tai nghe chụp',
            uv: 3000,
            pv: 6398
        },
        {
            name: 'Laptop',
            uv: 2000,
            pv: 9800
        },
        {
            name: 'Monitor',
            uv: 2780,
            pv: 3908
        },
        {
            name: 'Macbook',
            uv: 2780,
            pv: 6786
        },
        {
            name: 'Máy giặt',
            uv: 2780,
            pv: 4533
        },
        {
            name: 'Tủ Lạnh',
            uv: 2780,
            pv: 3456
        }
    ]
    console.log('top-10-view', views)

    useEffect(() => {
        if (widthRef.current) {
            setWidth(widthRef.current.clientWidth - 48)
        }
    }, [widthRef.current])

    return (
        <div className='bg-white p-[16px] rounded-8 border-border/20 border shadow-sm space-y-3' ref={widthRef}>
            <Flex justify={'between'} align={'center'}>
                <Text weight={'medium'} size={'4'}>
                    Top 10 sản phẩm lượt xem cao nhất
                </Text>
            </Flex>
            <BarChart
                width={width}
                height={400}
                data={views}
                className='flex-shrink-0 basis-2/3'
                layout='vertical'
                margin={{ right: 40 }}
            >
                <XAxis type='number' hide />
                <YAxis type='category' dataKey={'name'} hide />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={(data) => {
                        let view = data?.payload?.[0]?.payload
                        return (
                            <Box maxWidth='450px'>
                                <Card>
                                    <Flex gap='3' align='start'>
                                        <img
                                            src={view?.image}
                                            alt='top_10'
                                            className='rounded-8 overflow-hidden w-20 h-20 flex-shrink-0'
                                        />
                                        <Flex justify={'between'} direction={'column'}>
                                            <Text as='div' size='2' weight='bold'>
                                                {view?.name}
                                            </Text>
                                            <Flex gapX={'3'}>
                                                <Text size={'2'}>Tổng lượt view</Text>
                                                <Text size={'2'}>{view?.count}</Text>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </Box>
                        )
                    }}
                />
                <Bar dataKey='count' fill='#1677ff' barSize={50} shape={<Rectangle radius={6} />}>
                    <LabelList
                        dataKey={'name'}
                        position={'insideLeft'}
                        style={{ fill: '#FFF', fontSize: '50%' }}
                        content={(data) => {
                            let { x, y, width, value, height } = data
                            width = width ? +width * 0.9 : 0
                            height = height ? +height : 0
                            return (
                                <g>
                                    <foreignObject x={x} y={y} width={width} height={height} className='relative'>
                                        <Text
                                            className='text-white absolute left-2 top-1/2 -translate-y-1/2 line-clamp-1'
                                            size={'4'}
                                        >
                                            {value}
                                        </Text>
                                    </foreignObject>
                                </g>
                            )
                        }}
                    />
                    <LabelList dataKey={'count'} position={'right'} />
                </Bar>
            </BarChart>
        </div>
    )
}

export default Top10Product
