import { Flex, IconButton, Select, Text } from '@radix-ui/themes'
import { useState } from 'react'

type PaginationProps<T> = {
    setQuery: React.Dispatch<React.SetStateAction<T>>
    pagination: {
        page: number
        page_size: number
    }
}

const Pagination = function <T>({ pagination, setQuery }: PaginationProps<T>) {
    const [page, setPage] = useState<number>(pagination.page)

    const handeChangePage = (page: number) => () => {
        if (page > 0 && page <= (pagination.page_size as number)) {
            setPage(page)
            setQuery((pre) => {
                return {
                    ...pre,
                    page
                }
            })
        }
    }

    const handleLimitItem = (value: string) => {
        setQuery((pre) => {
            return {
                ...pre,
                limit: Number(value)
            }
        })
    }

    const handleGoToPage = (value: string) => {
        setPage(Number(value))
        setQuery((pre) => {
            return {
                ...pre,
                page: Number(value)
            }
        })
    }

    return (
        <Flex gapX={'4'}>
            <Flex gap={'2'}>
                <Select.Root
                    defaultValue={page.toString()}
                    size={'3'}
                    onValueChange={handleGoToPage}
                    value={page.toString()}
                >
                    <Select.Trigger />
                    <Select.Content position='popper' align='end' className='max-h-48 !rounded-8'>
                        <Select.Group>
                            <Select.Label>Trang</Select.Label>
                            {Array(pagination.page_size)
                                .fill(0)
                                .map((idx, page) => (
                                    <Select.Item key={idx} value={(page + 1).toString()}>{page + 1}</Select.Item>
                                ))}
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
                <Select.Root defaultValue='20' size={'3'} onValueChange={handleLimitItem}>
                    <Select.Trigger />
                    <Select.Content position='popper' className='!rounded-8' align='end'>
                        <Select.Group>
                            <Select.Label>Số lượng</Select.Label>
                            <Select.Item value='10'>10</Select.Item>
                            <Select.Item value='20'>20</Select.Item>
                            <Select.Item value='30'>30</Select.Item>
                            <Select.Item value='50'>50</Select.Item>
                            <Select.Item value='100'>100</Select.Item>
                        </Select.Group>
                    </Select.Content>
                </Select.Root>
            </Flex>
            <Flex justify={'center'} align={'center'}>
                <Text size={'5'}>
                    {pagination.page}/{pagination.page_size}
                </Text>
            </Flex>
            <Flex gap={'1'}>
                <IconButton
                    variant='outline'
                    color='gray'
                    size={'3'}
                    onClick={handeChangePage((pagination.page as number) - 1)}
                >
                    <svg width='20' height='20' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M8.81809 4.18179C8.99383 4.35753 8.99383 4.64245 8.81809 4.81819L6.13629 7.49999L8.81809 10.1818C8.99383 10.3575 8.99383 10.6424 8.81809 10.8182C8.64236 10.9939 8.35743 10.9939 8.1817 10.8182L5.1817 7.81819C5.09731 7.73379 5.0499 7.61933 5.0499 7.49999C5.0499 7.38064 5.09731 7.26618 5.1817 7.18179L8.1817 4.18179C8.35743 4.00605 8.64236 4.00605 8.81809 4.18179Z'
                            fill='currentColor'
                            fill-rule='evenodd'
                            clip-rule='evenodd'
                        ></path>
                    </svg>
                </IconButton>
                <IconButton
                    variant='outline'
                    color='gray'
                    size={'3'}
                    onClick={handeChangePage((pagination.page as number) + 1)}
                >
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
    )
}

export default Pagination
