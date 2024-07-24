import { MixerVerticalIcon, SpaceBetweenHorizontallyIcon } from '@radix-ui/react-icons'
import { Button, Flex, Popover, Select, Slider, Text } from '@radix-ui/themes'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useRef } from 'react'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { Order } from 'src/types/pagination.type'
import { Category, ProductQueryAndPagination } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

type ProductFilterProps = {
    setQuery: React.Dispatch<React.SetStateAction<ProductQueryAndPagination>>
    categories: { [key: string]: Category }
    range: number[]
    setRange: React.Dispatch<React.SetStateAction<number[]>>
    date: DateRange | undefined
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const ProductFilter = ({ categories, setQuery, date, range, setDate, setRange }: ProductFilterProps) => {
    const handleSlider = (value: number[]) => setRange(value)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

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

    useEffect(() => {
        if (date) {
            timeoutRef.current = setTimeout(() => {
                setQuery((pre) => {
                    if (date?.from) {
                        pre.min_date = date.from.toISOString()
                    }
                    if (date?.to) {
                        pre.max_date = date.to.toISOString()
                    }
                    return { ...pre }
                })
            }, 1000)
        }
        return () => {
            window.clearTimeout(timeoutRef.current)
        }
    }, [date])

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
                                    <Select.Item value='ACTIVE'>Đang hoạt động</Select.Item>
                                    <Select.Item value='BLOCK'>Bị khóa</Select.Item>
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
                                    <SpaceBetweenHorizontallyIcon />
                                    Giá
                                </Button>
                            </Popover.Trigger>
                            <Popover.Content align='end' width='800px' className='space-y-5 !rounded-8'>
                                <Slider
                                    defaultValue={range}
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
                                        <Select.Item key={key} value={key}>
                                            {value.name}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Root>
                        </Flex>
                    </Flex>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}

export default ProductFilter
