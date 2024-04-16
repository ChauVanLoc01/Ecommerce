import { Text } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

const COLORS = [
    '#1ABC9C',
    '#3498DB',
    '#E74C3C',
    '#F39C12',
    '#9B59B6',
    '#2ECC71',
    '#34495E',
    '#E67E22',
    '#2980B9',
    '#ECF0F1'
]

const ProductRate = () => {
    const widthRef = useRef<null | HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(0)

    const data = [
        {
            name: 'IPhone 15',
            value: 2400
        },
        {
            name: 'Acer nitro 5',
            value: 4567
        },
        {
            name: 'Macbook',
            value: 1398
        },
        {
            name: 'Samsung',
            value: 9800
        },
        {
            name: 'Cake',
            value: 3908
        },
        {
            name: 'Thiết bị điện tử',
            value: 4800
        }
    ]

    useEffect(() => {
        if (widthRef.current) {
            setWidth(widthRef.current.clientWidth - 48)
        }
    }, [widthRef.current])

    return (
        <div className='bg-white p-[16px] rounded-8 border-border/20 border shadow-sm space-y-4' ref={widthRef}>
            <Text weight={'medium'} size={'4'}>
                Tỉ lệ sản phẩm bán chạy
            </Text>
            <PieChart width={width} height={250}>
                <Tooltip />
                <Pie
                    data={data}
                    cx='50%'
                    cy='50%'
                    outerRadius={70}
                    fill='#1677ff'
                    dataKey='value'
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
                                <text
                                    x={x}
                                    y={y}
                                    fill={COLORS[index % COLORS.length]}
                                    textAnchor={x > cx ? 'start' : 'end'}
                                    dominantBaseline='central'
                                >
                                    {data[index].name}
                                </text>
                            </>
                        )
                    }}
                    labelLine
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </div>
    )
}

export default ProductRate
