import { Flex, Select, TextField } from '@radix-ui/themes'
import { addHours } from 'date-fns'
import { isUndefined, omit, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import Pagination from 'src/components/Pagination/Pagination'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { OrderStatusWithoutColor } from 'src/constants/order.status'
import { OrderQuery } from 'src/types/order.type'

type OrderFilterProps = {
    setQuery: React.Dispatch<React.SetStateAction<OrderQuery>>
    pagination: {
        page: number
        page_size: number
    }
}

const OrderFilter = ({ setQuery, pagination }: OrderFilterProps) => {
    const [date, setDate] = useState<DateRange | undefined>(undefined)

    const handleSelectStatus = (value: string) => {
        if (value !== 'All') {
            setQuery((pre) => {
                return {
                    ...pre,
                    status: value
                }
            })
        } else {
            setQuery((pre) => {
                return omit(pre, ['status'])
            })
        }
    }

    useEffect(() => {
        if (date) {
            setQuery((pre) => {
                return omitBy(
                    {
                        ...pre,
                        start_date: date.from ? addHours(date.from, 7) : undefined,
                        end_date: date.to ? addHours(date.to, 7) : undefined
                    } as OrderQuery,
                    isUndefined
                )
            })
        }
    }, [date])

    return (
        <Flex justify='between' width='100%'>
            <Flex gap={'3'}>
                <TextField.Root placeholder='Tìm kiếm đơn hàng...' size='3'>
                    <TextField.Slot>
                        <svg width='17' height='17' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
                    <Select.Root size='3' defaultValue='All' onValueChange={handleSelectStatus}>
                        <Select.Trigger />
                        <Select.Content position='popper'>
                            <Select.Item value='All'>Tất cả</Select.Item>
                            <Select.Item value={OrderStatusWithoutColor.CANCEL}>Đã hủy</Select.Item>
                            <Select.Item value={OrderStatusWithoutColor.SUCCESS}>Thành công</Select.Item>
                            <Select.Item value={OrderStatusWithoutColor.WAITING_CONFIRM}>Chờ xác nhận</Select.Item>
                            <Select.Item value={OrderStatusWithoutColor.SHIPING}>Đang giao hàng</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Flex>
                <DatePickerWithRange date={date} setDate={setDate} />
            </Flex>
            <Pagination pagination={pagination} setQuery={setQuery} />
        </Flex>
    )
}

export default OrderFilter
