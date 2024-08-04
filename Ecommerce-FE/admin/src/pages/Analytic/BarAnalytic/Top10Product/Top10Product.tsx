import { Card, Flex, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { AnalyticApi } from 'src/apis/analytics.api'
import { colors } from 'src/constants/color.constants'

const Top10Product = () => {
    const widthRef = useRef<null | HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(0)
    const { data: views } = useQuery({
        queryKey: ['top_10_view_product'],
        queryFn: AnalyticApi.top10ViewProduct,
        select: (result) => result.data
    })

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
            <Flex justify={'center'} align={'center'} width={`${width}px`}>
                <PieChart width={width} height={400}>
                    <Tooltip
                        content={(data) => {
                            console.log('tooltip content', data)
                            let result = data.payload?.[0]?.payload
                            return (
                                <Card>
                                    <Flex gapX={'2'} className='max-w-80'>
                                        <img
                                            src={result?.image}
                                            alt='pie_bg'
                                            className='w-20 h-20 rounded-6 overflow-hidden flex-shrink-0'
                                        />
                                        <Text>{result?.name}</Text>
                                    </Flex>
                                </Card>
                            )
                        }}
                    />
                    <Pie
                        data={views}
                        fill='#8884d8'
                        dataKey='count'
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                            const RADIAN = Math.PI / 180
                            const radius = 25 + innerRadius + (outerRadius - innerRadius)
                            const x = cx + radius * Math.cos(-midAngle * RADIAN)
                            const y = cy + radius * Math.sin(-midAngle * RADIAN)
                            const radius2 = innerRadius + (outerRadius - innerRadius) * 0.5
                            const x2 = cx + radius2 * Math.cos(-midAngle * RADIAN)
                            const y2 = cy + radius2 * Math.sin(-midAngle * RADIAN)
                            return (
                                <>
                                    <text
                                        x={x2}
                                        y={y2}
                                        fill='white'
                                        textAnchor={x2 > cx ? 'start' : 'end'}
                                        dominantBaseline='central'
                                    >
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
                                        {views?.[index].count} lượt xem
                                    </text>
                                </>
                            )
                        }}
                    >
                        {colors.map((color) => (
                            <Cell key={`color-1-${color}`} fill={color} />
                        ))}
                    </Pie>
                </PieChart>
            </Flex>
        </div>
    )
}

export default Top10Product
