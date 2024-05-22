import { Flex, Select, TextField } from '@radix-ui/themes'
import { addHours } from 'date-fns'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import Pagination from 'src/components/Pagination/Pagination'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { RatingQuery } from 'src/types/rating.type'
import { VoucherQuery } from 'src/types/voucher.type'

type RatingFilterProps = {
    setQuery: React.Dispatch<React.SetStateAction<RatingQuery>>
    page: number
    page_size: number
}

const RatingFilter = ({ page, page_size, setQuery }: RatingFilterProps) => {
    const [date, setDate] = useState<DateRange | undefined>(undefined)

    const handleSelectStatus = (status: string) => {
        setQuery((pre) => {
            return {
                ...pre,
                status
            }
        })
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
                <TextField.Root placeholder='Tìm kiếm mã giảm giá' size='3'>
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
                <Flex direction='column' width='120px' className='!rounded-8'>
                    <Select.Root size='3' defaultValue='all' onValueChange={handleSelectStatus}>
                        <Select.Trigger />
                        <Select.Content position='popper'>
                            <Select.Item value='all'>Tất cả</Select.Item>
                            <Select.Item value='0'>Chưa phản hồi</Select.Item>
                            <Select.Item value='1'>Đã phản hồi</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Flex>
                <DatePickerWithRange date={date} setDate={setDate} />
            </Flex>
            <Pagination pagination={{ page, page_size }} setQuery={setQuery} />
        </Flex>
    )
}

export default RatingFilter
