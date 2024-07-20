import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
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
                        <MagnifyingGlassIcon />
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
