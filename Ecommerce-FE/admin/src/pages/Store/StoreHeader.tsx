import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Flex, IconButton, Select, TextField, Tooltip } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { FaRegTrashAlt } from 'react-icons/fa'
import Pagination, { PaginationProps } from 'src/components/Pagination/Pagination'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { OrderLabel, OrderStatus } from 'src/constants/store.constants'
import { StoreQuery } from 'src/types/store.type'

type Props = {
    query: StoreQuery
    setQuery: React.Dispatch<React.SetStateAction<StoreQuery>>
    pagination: PaginationProps<StoreQuery>['pagination']
    date?: DateRange
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const StoreHeader = ({ setQuery, pagination, date, setDate, query }: Props) => {
    const [search_key, setSearch_key] = useState<string>('')
    const searchRef = useRef<any>(undefined)

    const handleSetSearchKey = () => setQuery((pre) => ({ ...pre, search_key }))

    const handleChangeSearchKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch_key(e.target.value)
    }

    const handleChangeStatus = (status: OrderStatus) => {
        setQuery((pre) => ({ ...pre, status }))
    }

    const handleClearFilter = () => {
        setDate(undefined)
        setSearch_key('')
        setQuery({ page: 1, limit: 10 })
    }

    useEffect(() => {
        searchRef.current = setTimeout(handleSetSearchKey, 300)
        return () => {
            clearTimeout(searchRef.current)
        }
    }, [search_key])

    useEffect(() => {
        setQuery((pre) => {
            let dateTmp = {
                start_date: date?.from,
                end_date: date?.to
            }
            return {
                ...pre,
                ...dateTmp
            }
        })
    }, [date])

    return (
        <Flex justify={'between'} align={'center'} id='store-header'>
            <Flex align={'center'} gap={'3'}>
                <TextField.Root
                    placeholder='Tìm kiếm cửa hàng'
                    size='3'
                    value={search_key}
                    onChange={handleChangeSearchKey}
                >
                    <TextField.Slot>
                        <MagnifyingGlassIcon />
                    </TextField.Slot>
                </TextField.Root>
                <Select.Root value={query?.status || 'DEFAULT'} size={'3'} onValueChange={handleChangeStatus}>
                    <Select.Trigger />
                    <Select.Content position='popper' align='end' className='rounded-8'>
                        <Select.Group>
                            <Select.Label>Trạng thái</Select.Label>
                            {Object.keys(OrderLabel).map((key) => (
                                <Select.Item key={key} value={key}>
                                    {OrderLabel[key as OrderStatus]}
                                </Select.Item>
                            ))}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
                <DatePickerWithRange date={date} setDate={setDate} />
                <Tooltip content='Xóa filter'>
                    <IconButton color='red' size={'3'} onClick={handleClearFilter}>
                        <FaRegTrashAlt />
                    </IconButton>
                </Tooltip>
            </Flex>
            <Pagination<StoreQuery> setQuery={setQuery} pagination={pagination} />
        </Flex>
    )
}

export default StoreHeader
