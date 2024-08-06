import { Card, Flex, Spinner, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'
import { AnalyticApi } from 'src/apis/analytics.api'
import { colors } from 'src/constants/color.constants'

const ProductRate = () => {
    const [activeIdx, setActiveIdx] = useState<number>(0)
    const widthRef = useRef<null | HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(0)

    const { data: bestSells } = useQuery({
        queryKey: ['rating_of_best_sell'],
        queryFn: AnalyticApi.ratingOfBestSell,
        staleTime: 1000 * 60 * 60 * 3,
        select: (result) => result.data
    })

    const { data: detail, refetch: detailRefetch } = useQuery({
        queryKey: ['product_detail_in_rating_of_best_sale', bestSells?.[activeIdx]?.productId],
        queryFn: AnalyticApi.getProductDetail(bestSells?.[activeIdx]?.productId || ''),
        select: (result) => result.data,
        staleTime: 1000 * 60 * 60 * 3,
        enabled: !!bestSells
    })

    const handleHover = (_: any, index: number) => {
        setActiveIdx(index)
    }

    useEffect(() => {
        if (widthRef.current) {
            setWidth(widthRef.current.clientWidth - 48)
        }
    }, [widthRef.current])

    useEffect(() => {
        if (bestSells) {
            detailRefetch()
        }
    }, [activeIdx])

    return (
        <div className='bg-white p-[16px] rounded-8 border-border/20 border shadow-sm space-y-4' ref={widthRef}>
            <Text weight={'medium'} size={'4'}>
                Tỉ lệ sản phẩm bán chạy
            </Text>
            <PieChart width={width} height={400}>
                <Tooltip
                    content={() => {
                        return (
                            <Card>
                                {detail ? (
                                    <Flex gapX={'2'} className='max-w-80'>
                                        <img
                                            src={detail?.image}
                                            alt='pie_bg'
                                            className='w-20 h-20 rounded-6 overflow-hidden flex-shrink-0'
                                        />
                                        <div>
                                            <Text>{detail?.name}</Text>
                                            <Flex>
                                                <Text>Số lượng bán: </Text>
                                                <Text>{bestSells?.[activeIdx]?.quantity}</Text>
                                            </Flex>
                                        </div>
                                    </Flex>
                                ) : (
                                    <Flex justify={'center'} align={'center'} gapX={'2'} className='w-80 h-44'>
                                        <Spinner />
                                    </Flex>
                                )}
                            </Card>
                        )
                    }}
                />
                <Pie
                    data={bestSells}
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
                                    {bestSells?.[index].count} lượt bán
                                </text>
                            </>
                        )
                    }}
                    onMouseEnter={handleHover}
                >
                    {colors.map((color) => (
                        <Cell key={`color-1-${color}`} fill={color} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    )
}

export default ProductRate
