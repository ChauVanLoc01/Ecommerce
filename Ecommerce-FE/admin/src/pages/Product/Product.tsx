import { Button, Flex, IconButton, Kbd, Popover, Select, Slider, Text, TextField } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { ProductApi } from 'src/apis/product.api'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { Order } from 'src/types/pagination.type'
import { ProductAnalyticResponse, ProductQueryAndPagination } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'
import LayoutProfile from '../Profile/LayoutProfile'
import ProductTable from './ProductTable'
import { useLoaderData } from 'react-router-dom'

const Product = () => {
    const [query, setQuery] = useState<ProductQueryAndPagination>({})
    const [range, setRange] = useState<number[]>([0, 0])
    const [date, setDate] = useState<DateRange | undefined>(undefined)
    const [page, setPage] = useState<number>(1)

    const [analytics] = useLoaderData() as [ProductAnalyticResponse]

    console.log('anylytics', analytics)

    const { refetch, data } = useQuery({
        queryKey: ['productList', JSON.stringify(query)],
        queryFn: () => ProductApi.getAllProduct(query),
        placeholderData: (previousData) => previousData,
        enabled: false
    })

    const handleSlider = (value: number[]) => setRange(value)

    const handleQueryProductByPrice = () =>
        setQuery((pre) => {
            return {
                ...pre,
                price_min: range[0],
                price_max: range[1]
            }
        })

    const handeChangePage = (page: number) => () => {
        if (page > 0 && page <= (data?.data.result.query.page_size as number)) {
            setPage(page)
            setQuery((pre) => {
                return {
                    ...pre,
                    page
                }
            })
        }
    }

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

    const handleLimitItem = (value: string) => {
        setQuery((pre) => {
            return {
                ...pre,
                limit: Number(value)
            }
        })
    }

    const handleGoToPage = (value: string) => {
        setPage(Number(value))
        setQuery((pre) => {
            return {
                ...pre,
                page: Number(value)
            }
        })
    }

    useEffect(() => {
        if (data) {
            setPage(data.data.result.query.page)
        }
    }, [data])

    useEffect(() => {
        if (date) {
            setQuery((pre) => {
                return {
                    ...pre,
                    min_date: date.from?.toISOString() as string,
                    max_date: date.to?.toISOString() as string
                }
            })
        }
    }, [date])

    useEffect(() => {
        Object.keys(query).length && refetch()
    }, [query])

    return (
        <LayoutProfile title='Quản lý sản phẩm'>
            <div className='bg-white rounded-8 border-border/30 space-y-4'>
                <Flex gapX={'6'}>
                    <Flex gapX={'2'} align={'center'}>
                        <Text size={'4'}>Tổng sản phẩm:</Text>
                        <Kbd size={'4'} className='rounded-6 font-medium !text-green-500'>
                            {analytics.result.all}
                        </Kbd>
                    </Flex>
                    <Flex gapX={'2'} align={'center'}>
                        <Text size={'4'}>Đang bán:</Text>
                        <Kbd size={'4'} className='rounded-6 font-medium !text-blue'>
                            {analytics.result.active}
                        </Kbd>
                    </Flex>
                    <Flex gapX={'2'} align={'center'}>
                        <Text size={'4'}>Đã ẩn:</Text>
                        <Kbd size={'4'} className='rounded-6 font-medium !text-yellow-500'>
                            {analytics.result.block}
                        </Kbd>
                    </Flex>
                    <Flex gapX={'2'} align={'center'}>
                        <Text size={'4'}>Đã xóa:</Text>
                        <Kbd size={'4'} className='rounded-6 font-medium !text-red'>
                            {analytics.result.deleted}
                        </Kbd>
                    </Flex>
                </Flex>
                <Flex justify='between' width='100%'>
                    <Flex gap={'3'}>
                        <TextField.Root placeholder='Tìm kiếm sản phẩm...' size='3'>
                            <TextField.Slot>
                                <svg
                                    width='17'
                                    height='17'
                                    viewBox='0 0 15 15'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z'
                                        fill='currentColor'
                                        fill-rule='evenodd'
                                        clip-rule='evenodd'
                                    ></path>
                                </svg>
                            </TextField.Slot>
                        </TextField.Root>
                        <Flex direction='column' width='180px'>
                            <Select.Root size='3' onValueChange={handleSelectChange}>
                                <Select.Trigger placeholder='Sắp xếp' />
                                <Select.Content position='popper'>
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
                        </Flex>
                        <DatePickerWithRange date={date} setDate={setDate} />
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
                            <Popover.Content align='end' width='800px' className='rounded-8 space-y-5'>
                                <Slider
                                    defaultValue={[35000, 55000]}
                                    min={1000}
                                    max={1000000}
                                    onValueChange={handleSlider}
                                    step={1000}
                                />
                                <Flex gapX={'4'} justify={'end'}>
                                    <Flex gap={'2'} align={'center'}>
                                        Min: <Text color='red'>{convertCurrentcy(range[0])}đ</Text>
                                    </Flex>
                                    <Flex gap={'2'} align={'center'}>
                                        Min: <Text color='blue'>{convertCurrentcy(range[1])}đ</Text>
                                    </Flex>
                                    <Button onClick={handleQueryProductByPrice}>Tìm kiếm</Button>
                                </Flex>
                            </Popover.Content>
                        </Popover.Root>
                    </Flex>
                    <Flex gap={'2'}>
                        <Select.Root
                            defaultValue={page.toString()}
                            size={'3'}
                            onValueChange={handleGoToPage}
                            value={page.toString()}
                        >
                            <Select.Trigger />
                            <Select.Content position='popper' className='max-h-48'>
                                <Select.Group>
                                    <Select.Label>Đi đến trang</Select.Label>
                                    {Array(data?.data.result.query.page_size)
                                        .fill(0)
                                        .map((_, page) => (
                                            <Select.Item value={(page + 1).toString()}>{page + 1}</Select.Item>
                                        ))}
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                        <Select.Root defaultValue='20' size={'3'} onValueChange={handleLimitItem}>
                            <Select.Trigger />
                            <Select.Content position='popper'>
                                <Select.Group>
                                    <Select.Label>Số lượng</Select.Label>
                                    <Select.Item value='10'>10</Select.Item>
                                    <Select.Item value='20'>20</Select.Item>
                                    <Select.Item value='30'>30</Select.Item>
                                    <Select.Item value='50'>50</Select.Item>
                                    <Select.Item value='100'>100</Select.Item>
                                </Select.Group>
                            </Select.Content>
                        </Select.Root>
                        <Flex justify={'center'} align={'center'}>
                            <Text size={'5'}>
                                {data?.data.result.query.page}/{data?.data.result.query.page_size}
                            </Text>
                        </Flex>
                        <Flex gap={'1'}>
                            <IconButton
                                variant='outline'
                                color='gray'
                                size={'3'}
                                onClick={handeChangePage((data?.data.result.query.page as number) - 1)}
                            >
                                <svg
                                    width='20'
                                    height='20'
                                    viewBox='0 0 15 15'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z'
                                        fill='currentColor'
                                        fill-rule='evenodd'
                                        clip-rule='evenodd'
                                    ></path>
                                </svg>
                            </IconButton>
                            <IconButton
                                variant='outline'
                                color='gray'
                                size={'3'}
                                onClick={handeChangePage((data?.data.result.query.page as number) + 1)}
                            >
                                <svg
                                    width='20'
                                    height='20'
                                    viewBox='0 0 15 15'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        d='M6.18194 4.18185C6.35767 4.00611 6.6426 4.00611 6.81833 4.18185L9.81833 7.18185C9.90272 7.26624 9.95013 7.3807 9.95013 7.50005C9.95013 7.6194 9.90272 7.73386 9.81833 7.81825L6.81833 10.8182C6.6426 10.994 6.35767 10.994 6.18194 10.8182C6.0062 10.6425 6.0062 10.3576 6.18194 10.1819L8.86374 7.50005L6.18194 4.81825C6.0062 4.64251 6.0062 4.35759 6.18194 4.18185Z'
                                        fill='currentColor'
                                        fill-rule='evenodd'
                                        clip-rule='evenodd'
                                    ></path>
                                </svg>
                            </IconButton>
                        </Flex>
                    </Flex>
                </Flex>
                {data && <ProductTable data={data.data} />}
            </div>
        </LayoutProfile>
    )
}

export default Product
