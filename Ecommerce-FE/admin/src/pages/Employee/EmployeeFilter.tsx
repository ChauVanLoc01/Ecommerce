import { Flex, Select, TextField } from '@radix-ui/themes'
import { addHours } from 'date-fns'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import Pagination from 'src/components/Pagination/Pagination'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { EmployeeQuery } from 'src/types/employee.type'

type EmployeeFilterProps = {
    setQuery: React.Dispatch<React.SetStateAction<EmployeeQuery>>
    pagination: {
        page: number
        page_size: number
    }
}

const EmployeeFilter = ({ setQuery, pagination }: EmployeeFilterProps) => {
    const [date, setDate] = useState<DateRange | undefined>(undefined)

    const handleChangeStatus = (value: string) =>
        setQuery((pre) => {
            return {
                ...pre,
                status: value
            }
        })

    useEffect(() => {
        if (date) {
            setQuery((pre) => {
                return omitBy(
                    {
                        ...pre,
                        start_date: date.from ? addHours(date.from, 7) : undefined,
                        end_date: date.to ? addHours(date.to, 7) : undefined
                    },
                    isUndefined
                )
            })
        }
    }, [date])

    return (
        <Flex justify='between' width='100%'>
            <Flex gap={'3'}>
                <TextField.Root placeholder='Tìm kiếm nhân viên...' size='3'>
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
                <Flex direction='column' width='150px'>
                    <Select.Root size='3' defaultValue='ACTIVE' onValueChange={handleChangeStatus}>
                        <Select.Trigger placeholder='Trạng thái' />
                        <Select.Content position='popper' className='!rounded-8'>
                            <Select.Item value='ACTIVE'>Hoạt động</Select.Item>
                            <Select.Item value='BLOCK'>Bị khóa</Select.Item>
                        </Select.Content>
                    </Select.Root>
                </Flex>
                <DatePickerWithRange date={date} setDate={setDate} />
            </Flex>
            <Pagination pagination={pagination} setQuery={setQuery} />
        </Flex>
    )
}

export default EmployeeFilter
