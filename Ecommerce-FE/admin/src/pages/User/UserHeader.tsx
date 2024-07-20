import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Flex, Select, TextField } from '@radix-ui/themes'
import { useEffect } from 'react'
import { DateRange } from 'react-day-picker'
import Pagination, { PaginationProps } from 'src/components/Pagination/Pagination'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { Status } from 'src/constants/product.status'
import { OrderLabel, OrderStatus } from 'src/constants/store.constants'
import { StoreQuery } from 'src/types/store.type'

type Props = {
    setQuery: React.Dispatch<React.SetStateAction<StoreQuery>>
    pagination: PaginationProps<StoreQuery>['pagination']
    date?: DateRange
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const UserHeader = ({ setQuery, pagination, date, setDate }: Props) => {
    useEffect(() => {
        if (date) {
            setQuery((pre) => ({
                ...pre,
                start_date: date.from,
                end_date: date.to
            }))
        }
    }, [date])

    return (
        <Flex justify={'between'} align={'center'}>
            <Flex align={'center'} gap={'3'}>
                <TextField.Root placeholder='Tìm kiếm người dùng' size='3'>
                    <TextField.Slot>
                        <MagnifyingGlassIcon />
                    </TextField.Slot>
                </TextField.Root>
                <Select.Root defaultValue={Status.active} size={'3'}>
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
            </Flex>
            <Pagination<StoreQuery> setQuery={setQuery} pagination={pagination} />
        </Flex>
    )
}

export default UserHeader
