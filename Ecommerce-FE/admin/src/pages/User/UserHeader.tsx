import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Flex, IconButton, Select, TextField, Tooltip } from '@radix-ui/themes'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { FaRegTrashAlt } from 'react-icons/fa'
import Pagination, { PaginationProps } from 'src/components/Pagination/Pagination'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { OrderLabel, OrderStatus } from 'src/constants/store.constants'
import { StoreQuery } from 'src/types/store.type'
import { UserQuery } from 'src/types/user.type'

type Props = {
    query: UserQuery
    setQuery: React.Dispatch<React.SetStateAction<StoreQuery>>
    pagination: PaginationProps<StoreQuery>['pagination']
    date?: DateRange
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const UserHeader = ({ setQuery, pagination, date, setDate, query }: Props) => {
    const [search_key, setSearch_key] = useState<string>('')
    const searchRef = useRef<any>(undefined)

    const handleChangeStatus = (status: OrderStatus) => {
        setQuery((pre) => ({ ...pre, status }))
    }

    const handleChangeSearchKey = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch_key(e.target.value)
    }

    const handleSetSearchKey = () => setQuery((pre) => ({ ...pre, search_key }))

    const handleClearFilter = () => setQuery({ page: 1, limit: 10 })

    useEffect(() => {
        if (date) {
            setQuery((pre) => ({
                ...pre,
                start_date: date.from,
                end_date: date.to
            }))
        } else {
            setQuery((pre) => {
                pre.start_date = date?.['from']
                pre.end_date = date?.['to']
                return omitBy(pre, isUndefined)
            })
        }
    }, [date])

    useEffect(() => {
        searchRef.current = setTimeout(handleSetSearchKey, 300)
        return () => {
            clearTimeout(searchRef.current)
        }
    }, [search_key])

    return (
        <Flex justify={'between'} align={'center'}>
            <Flex align={'center'} gap={'3'}>
                <TextField.Root placeholder='Tìm kiếm người dùng' size='3' onChange={handleChangeSearchKey}>
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
                                <Select.Item value={key}>{OrderLabel[key as OrderStatus]}</Select.Item>
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

export default UserHeader
