import { Flex, IconButton, Select, Text, TextField } from '@radix-ui/themes'
import { addHours } from 'date-fns'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { DatePickerWithRange } from 'src/components/Shadcn/dateRange'
import { EmployeeQuery } from 'src/types/employee.type'

type EmployeeFilterProps = {
    setQuery: React.Dispatch<React.SetStateAction<EmployeeQuery>>
    page: number
    page_size: number
}

const EmployeeFilter = ({ setQuery, page: pageFromResponse, page_size }: EmployeeFilterProps) => {
    const [date, setDate] = useState<DateRange | undefined>(undefined)
    const [page, setPage] = useState<number>(pageFromResponse)

    const handleChangeStatus = (value: string) =>
        setQuery((pre) => {
            return {
                ...pre,
                status: value
            }
        })

    const handleNextPage = () => {
        if (page < page_size) {
            setPage(page + 1)
            setQuery((pre) => {
                return {
                    ...pre,
                    page: page + 1
                }
            })
        }
    }

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1)
            setQuery((pre) => {
                return {
                    ...pre,
                    page: page - 1
                }
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
            <Flex gap={'3'}>
                <Flex justify={'center'} align={'center'}>
                    <Text size={'5'}>
                        {page}/{page_size}
                    </Text>
                </Flex>
                <Flex gap={'1'}>
                    <IconButton variant='outline' color='gray' size={'3'} onClick={handlePreviousPage}>
                        <svg width='20' height='20' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path
                                d='M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z'
                                fill='currentColor'
                                fill-rule='evenodd'
                                clip-rule='evenodd'
                            ></path>
                        </svg>
                    </IconButton>
                    <IconButton variant='outline' color='gray' size={'3'} onClick={handleNextPage}>
                        <svg width='20' height='20' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
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
    )
}

export default EmployeeFilter
