import { Flex, IconButton, Select, Text } from '@radix-ui/themes'
import { useRef } from 'react'
import { Bar, BarChart, Rectangle, Tooltip } from 'recharts'

const CustomerStatistic = () => {
    const widthRef = useRef<null | HTMLDivElement>(null)
    const data = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 4400
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 6398
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 9800
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908
        },
        {
            name: 'Page B',
            uv: 3000,
            pv: 8398
        },
        {
            name: 'Page C',
            uv: 2000,
            pv: 5800
        },
        {
            name: 'Page D',
            uv: 2780,
            pv: 3908
        }
    ]
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
                        Khách Hàng
                    </Text>
                </Flex>
                <Select.Root defaultValue='day' size={'2'}>
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value='day'>Day</Select.Item>
                        <Select.Item value='month'>Month</Select.Item>
                        <Select.Item value='year'>Year</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Flex>
            <Flex className='rounded-8 bg-gray-100 p-12 w-full' justify={'between'}>
                <BarChart
                    width={widthRef.current ? ((widthRef.current.offsetWidth - 32) / 3) * 2 : 300}
                    height={80}
                    data={data}
                    className='flex-shrink-0 basis-2/3'
                >
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey='pv' fill='#cf1322' barSize={30} shape={<Rectangle radius={6} />} />
                </BarChart>
                <Flex direction={'column'} justify={'center'} align={'center'} className='basis-1/3 flex-shrink-0'>
                    <Text weight={'medium'} size={'4'}>
                        +10tr
                    </Text>
                    <Text weight={'medium'} size={'3'} color='blue' className='flex items-center space-x-1'>
                        <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                        <span>110%</span>
                    </Text>
                </Flex>
            </Flex>
        </div>
    )
}

export default CustomerStatistic
