import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Flex, IconButton, Select, Text } from '@radix-ui/themes'
import { useState } from 'react'

export type PaginationProps<T> = {
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
                                    <Select.Item key={`pagination-${idx}`} value={(page + 1).toString()}>
                                        {page + 1}
                                    </Select.Item>
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
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton
                    variant='outline'
                    color='gray'
                    size={'3'}
                    onClick={handeChangePage((pagination.page as number) + 1)}
                >
                    <ChevronRightIcon />
                </IconButton>
            </Flex>
        </Flex>
    )
}

export default Pagination
