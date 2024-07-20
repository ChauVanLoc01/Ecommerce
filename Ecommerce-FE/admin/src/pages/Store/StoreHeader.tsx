import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Flex, TextField } from '@radix-ui/themes'
import { DateRange } from 'react-day-picker'
import Pagination, { PaginationProps } from 'src/components/Pagination/Pagination'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { StoreQuery } from 'src/types/store.type'

type Props = {
    setQuery: React.Dispatch<React.SetStateAction<StoreQuery>>
    pagination: PaginationProps<StoreQuery>['pagination']
    date?: DateRange
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
}

const StoreHeader = ({ setQuery, pagination, date, setDate }: Props) => {
    return (
        <Flex justify={'between'} align={'center'}>
            <Flex align={'center'} gap={'3'}>
                <TextField.Root placeholder='Tìm kiếm cửa hàng' size='3'>
                    <TextField.Slot>
                        <MagnifyingGlassIcon />
                    </TextField.Slot>
                </TextField.Root>
                <DatePickerWithRange date={date} setDate={setDate} />
            </Flex>
            <Pagination<StoreQuery> setQuery={setQuery} pagination={pagination} />
        </Flex>
    )
}

export default StoreHeader
