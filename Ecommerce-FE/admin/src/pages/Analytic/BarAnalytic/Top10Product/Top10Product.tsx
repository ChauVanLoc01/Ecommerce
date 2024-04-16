import { Flex, Text } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, LabelList, Rectangle, Tooltip, XAxis, YAxis } from 'recharts'

const Top10Product = () => {
    const widthRef = useRef<null | HTMLDivElement>(null)
    const [width, setWidth] = useState<number>(0)
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

    useEffect(() => {
        if (widthRef.current) {
            setWidth(widthRef.current.clientWidth - 48)
        }
    }, [widthRef.current])
    

    return (
        <div className='bg-white p-[16px] rounded-8 border-border/20 border shadow-sm space-y-3' ref={widthRef}>
            <Flex justify={'between'} align={'center'}>
                <Text weight={'medium'} size={'4'}>
                    Top 10 sản phẩm trong tháng
                </Text>
            </Flex>
            <BarChart
                width={width}
                height={300}
                data={data}
                className='flex-shrink-0 basis-2/3'
                layout='vertical'
            >
                <XAxis type='number' hide />
                <YAxis type='category' dataKey={'name'} hide />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey='pv' fill='#1677ff' barSize={35} shape={<Rectangle radius={6} />}>
                    <LabelList dataKey={'name'} position={'insideLeft'} style={{ fill: '#FFF', fontSize: '50%' }} />
                    <LabelList dataKey={'pv'} position={'right'} />
                </Bar>
            </BarChart>
        </div>
    )
}

export default Top10Product
