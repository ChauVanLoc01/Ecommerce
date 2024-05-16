import { MixerVerticalIcon } from '@radix-ui/react-icons'
import { Button, Flex, Popover, Select, Slider, Text } from '@radix-ui/themes'
import { isUndefined, omitBy } from 'lodash'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { Order } from 'src/types/pagination.type'
import { Category, ProductQueryAndPagination } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

type ProductFilterProps = {
    setQuery: React.Dispatch<React.SetStateAction<ProductQueryAndPagination>>
    categories: { [key: string]: Category }
}

const ProductFilter = ({ categories, setQuery }: ProductFilterProps) => {
    const [range, setRange] = useState<number[]>([0, 0])
    const [date, setDate] = useState<DateRange | undefined>(undefined)

    const handleSlider = (value: number[]) => setRange(value)

    const handleQueryProductByPrice = () =>
        setQuery((pre) => {
            return {
                ...pre,
                price_min: range[0],
                price_max: range[1]
            }
        })

    const handleSelectChange = (value: string) => {
        const [orderKey, orderValue] = value.split('_')
        switch (orderKey) {
            case 'createdAt':
                setQuery((pre) => {
                    return omitBy(
                        {
                            ...pre,
                            createdAt: orderValue as Order,
                            sold: undefined,
                            price: undefined
                        },
                        isUndefined
                    )
                })
                break
            case 'sold':
                setQuery((pre) => {
                    return omitBy(
                        {
                            ...pre,
                            createdAt: undefined,
                            price: undefined,
                            sold: orderValue as Order
                        },
                        isUndefined
                    )
                })
                break
            default:
                setQuery((pre) => {
                    return omitBy(
                        {
                            ...pre,
                            sold: undefined,
                            createdAt: undefined,
                            price: orderValue as Order
                        },
                        isUndefined
                    )
                })
                break
        }
    }

    const handleCategoryChange = (value: string) => {
        setQuery((pre) => {
            return {
                ...pre,
                category: value
            }
        })
    }

    const handleStatus = (value: string) => {
        setQuery((pre) => {
            return {
                ...pre,
                status: value
            }
        })
    }

    const handleClearFilter = () => {}

    return (
        <Popover.Root>
            <Popover.Trigger>
                <Button variant='outline' size={'3'} color='gray'>
                    <MixerVerticalIcon />
                    Filter
                </Button>
            </Popover.Trigger>
            <Popover.Content className='!rounded-8'>
                <Flex gap={'4'} direction={'column'}>
                    <Flex gapX={'3'}>
                        <Select.Root size='3' onValueChange={handleStatus}>
                            <Select.Trigger placeholder='Status' className='!flex-grow' />
                            <Select.Content position='popper' className='!rounded-8'>
                                <Select.Group>
                                    <Select.Label>Trạng thái</Select.Label>
                                    <Select.Item value='ACTIVE'>ACTIVE</Select.Item>
                                    <Select.Item value='BLOCK'>BLOCK</Select.Item>
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                        <DatePickerWithRange date={date} setDate={setDate} />
                    </Flex>
                    <Flex gapX={'3'}>
                        <Select.Root size='3' onValueChange={handleSelectChange}>
                            <Select.Trigger placeholder='Sắp xếp' />
                            <Select.Content position='popper' className='!rounded-8'>
                                <Select.Group>
                                    <Select.Label>Thời gian</Select.Label>
                                    <Select.Item value='createdAt_asc'>Cũ nhất</Select.Item>
                                    <Select.Item value='createdAt_desc'>Mới nhất</Select.Item>
                                </Select.Group>
                                <Select.Separator />
                                <Select.Group>
                                    <Select.Label>Đã bán</Select.Label>
                                    <Select.Item value='sold_desc'>Bán chạy nhất</Select.Item>
                                </Select.Group>
                                <Select.Separator />
                                <Select.Group>
                                    <Select.Label>Giá bán</Select.Label>
                                    <Select.Item value='price_asc'>Giá tăng dần</Select.Item>
                                    <Select.Item value='price_desc'>Giá giảm dần</Select.Item>
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                        <Popover.Root>
                            <Popover.Trigger>
                                <Button variant='outline' size={'3'} color='gray'>
                                    <svg
                                        width='15'
                                        height='15'
                                        viewBox='0 0 15 15'
                                        fill='none'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            d='M14.4999 0.999992C14.2237 0.999992 13.9999 1.22385 13.9999 1.49999L13.9999 13.4999C13.9999 13.776 14.2237 13.9999 14.4999 13.9999C14.776 13.9999 14.9999 13.776 14.9999 13.4999L14.9999 1.49999C14.9999 1.22385 14.776 0.999992 14.4999 0.999992ZM0.499996 0.999992C0.223856 0.999992 -9.78509e-09 1.22385 -2.18556e-08 1.49999L4.07279e-07 13.4999C3.95208e-07 13.776 0.223855 13.9999 0.499996 13.9999C0.776136 13.9999 0.999992 13.776 0.999992 13.4999L0.999992 1.49999C0.999992 1.22385 0.776136 0.999992 0.499996 0.999992ZM1.99998 6.99994C1.99998 6.44766 2.44769 5.99995 2.99998 5.99995L5.99995 5.99995C6.55223 5.99995 6.99994 6.44766 6.99994 6.99994L6.99994 7.99993C6.99994 8.55221 6.55223 8.99992 5.99995 8.99992L2.99998 8.99992C2.4477 8.99992 1.99998 8.55221 1.99998 7.99993L1.99998 6.99994ZM8.99993 5.99995C8.44765 5.99995 7.99993 6.44766 7.99993 6.99994L7.99993 7.99993C7.99993 8.55221 8.44765 8.99992 8.99993 8.99992L11.9999 8.99992C12.5522 8.99992 12.9999 8.55221 12.9999 7.99993L12.9999 6.99994C12.9999 6.44766 12.5522 5.99995 11.9999 5.99995L8.99993 5.99995Z'
                                            fill='currentColor'
                                            fill-rule='evenodd'
                                            clip-rule='evenodd'
                                        ></path>
                                    </svg>
                                    Giá
                                </Button>
                            </Popover.Trigger>
                            <Popover.Content align='end' width='800px' className='space-y-5 !rounded-8'>
                                <Slider
                                    defaultValue={[35000, 55000]}
                                    min={1000}
                                    max={1000000}
                                    onValueChange={handleSlider}
                                    step={1000}
                                />
                                <Flex gapX={'4'} justify={'end'}>
                                    <Flex gap={'2'} align={'center'}>
                                        Min: <Text color='red'>{convertCurrentcy(range[0])}</Text>
                                    </Flex>
                                    <Flex gap={'2'} align={'center'}>
                                        Min: <Text color='blue'>{convertCurrentcy(range[1])}</Text>
                                    </Flex>
                                    <Button onClick={handleQueryProductByPrice}>Tìm kiếm</Button>
                                </Flex>
                            </Popover.Content>
                        </Popover.Root>
                        <Flex direction='column' width='400px'>
                            <Select.Root size='3' onValueChange={handleCategoryChange}>
                                <Select.Trigger placeholder='Danh mục' />
                                <Select.Content position='popper' className='!rounded-8' align='end'>
                                    {Object.entries(categories).map(([key, value]) => (
                                        <Select.Item key={key} value={key}>{value.name}</Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>
                        </Flex>
                    </Flex>
                    <Flex justify={'end'} gapX={'4'}>
                        <Button variant='soft' size={'2'} color='red' onClick={handleClearFilter}>
                            Xóa tất cả
                        </Button>
                        <Button>Tìm kiếm</Button>
                    </Flex>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}

export default ProductFilter
