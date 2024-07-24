import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Flex, Select, TextField } from '@radix-ui/themes'
import { addHours } from 'date-fns'
import { isUndefined, omitBy } from 'lodash'
import { useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import Pagination from 'src/components/Pagination/Pagination'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { OrderLabel, OrderStatus } from 'src/constants/store.constants'
import { VoucherQuery } from 'src/types/voucher.type'

type VoucherFilterProps = {
    query: VoucherQuery
    setQuery: React.Dispatch<React.SetStateAction<VoucherQuery>>
    page: number
    page_size: number
    search_key: string
    setSearch_key: React.Dispatch<React.SetStateAction<string>>
    date: DateRange | undefined
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const VoucherFilter = ({
    setQuery,
    page,
    page_size,
    query,
    date,
    search_key,
    setDate,
    setSearch_key
}: VoucherFilterProps) => {
    const handleChangeStatus = (status: string) => {
        setQuery((pre) => ({ ...pre, status }))
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch_key(e.target.value)
    }

    useEffect(() => {
        if (date) {
            setQuery((pre) => {
                return omitBy(
                    {
                        ...pre,
                        startDate: date.from ? addHours(date.from, 7) : undefined,
                        endDate: date.to ? addHours(date.to, 7) : undefined
                    } as VoucherQuery,
                    isUndefined
                )
            })
        }
    }, [date])

    return (
        <Flex justify={'between'}>
            <Flex gap={'3'}>
                <TextField.Root placeholder='Tìm kiếm mã giảm giá' size='3' value={search_key} onChange={handleSearch}>
                    <TextField.Slot>
                        <MagnifyingGlassIcon />
                    </TextField.Slot>
                </TextField.Root>
                <Flex direction='column' width='120px'>
                    <Select.Root value={query?.status || 'DEFAULT'} size={'3'} onValueChange={handleChangeStatus}>
                        <Select.Trigger />
                        <Select.Content position='popper' align='end' className='rounded-8'>
                            <Select.Group>
                                <Select.Label>Trạng thái</Select.Label>
                                {Object.keys(OrderLabel).map((key) => (
                                    <Select.Item key={`voucher_${key}`} value={key}>
                                        {OrderLabel[key as OrderStatus]}
                                    </Select.Item>
                                ))}
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Flex>
                <DatePickerWithRange date={date} setDate={setDate} />
            </Flex>
            <Pagination pagination={{ page, page_size }} setQuery={setQuery} />
        </Flex>
    )
}

export default VoucherFilter
