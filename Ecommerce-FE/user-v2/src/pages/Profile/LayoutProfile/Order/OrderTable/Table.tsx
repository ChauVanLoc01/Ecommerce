import * as React from 'react'

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { BiSolidSortAlt } from 'react-icons/bi'
import { IoSearchOutline } from 'react-icons/io5'

import { Button, DropdownMenu, Flex } from '@radix-ui/themes'
import InputIcon from 'src/components/InputIcon'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/Shadcn/table'

const data: Payment[] = [
    {
        id: 'm5gr84i9',
        amount: 316,
        status: 'success',
        email: 'ken99@yahoo.com'
    },
    {
        id: 'm5gr84i9',
        amount: 316,
        status: 'success',
        email: 'ken99@yahoo.com'
    },
    {
        id: 'm5gr84i9',
        amount: 316,
        status: 'success',
        email: 'ken99@yahoo.com'
    },
    {
        id: '3u1reuv4',
        amount: 242,
        status: 'success',
        email: 'Abe45@gmail.com'
    },
    {
        id: 'derv1ws0',
        amount: 837,
        status: 'processing',
        email: 'Monserrat44@gmail.com'
    },
    {
        id: '5kma53ae',
        amount: 874,
        status: 'success',
        email: 'Silas22@gmail.com'
    },
    {
        id: 'bhqecj4p',
        amount: 721,
        status: 'failed',
        email: 'carmella@hotmail.com'
    }
]

export type Payment = {
    id: string
    amount: number
    status: 'pending' | 'processing' | 'success' | 'failed'
    email: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: 'status',
        header: () => {
            return (
                <div className='flex items-center gap-x-2'>
                    Mã đơn hàng
                    <BiSolidSortAlt />
                </div>
            )
        },
        cell: ({ row }) => <div className='capitalize'>{row.getValue('status')}</div>
    },
    {
        accessorKey: 'email',
        header: () => {
            return (
                <div className='flex items-center gap-x-2'>
                    Thời gian đặt hàng
                    <BiSolidSortAlt />
                </div>
            )
        },
        cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>
    },
    {
        accessorKey: 'amount',
        header: () => (
            <div className='flex items-center gap-x-2'>
                Tổng tiền
                <BiSolidSortAlt />
            </div>
        ),
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount)

            return <div className='font-medium'>{formatted}</div>
        }
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: () => {
            return (
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant='ghost' color='gray'>
                            <svg
                                width='15'
                                height='15'
                                viewBox='0 0 15 15'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M8.625 2.5C8.625 3.12132 8.12132 3.625 7.5 3.625C6.87868 3.625 6.375 3.12132 6.375 2.5C6.375 1.87868 6.87868 1.375 7.5 1.375C8.12132 1.375 8.625 1.87868 8.625 2.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM7.5 13.625C8.12132 13.625 8.625 13.1213 8.625 12.5C8.625 11.8787 8.12132 11.375 7.5 11.375C6.87868 11.375 6.375 11.8787 6.375 12.5C6.375 13.1213 6.87868 13.625 7.5 13.625Z'
                                    fill='currentColor'
                                    fill-rule='evenodd'
                                    clip-rule='evenodd'
                                ></path>
                            </svg>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>Chi tiết</DropdownMenu.Item>
                        <DropdownMenu.Item color='blue'>Chỉnh sửa</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item color='red'>Delete</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            )
        }
    }
]

export function OrderTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        }
    })

    return (
        <div className='w-full'>
            <div className='flex items-center py-4'>
                <InputIcon
                    icon={<IoSearchOutline className='text-gray-400' />}
                    placeholder='Tìm kiếm'
                    className='max-w-sm'
                />
            </div>
            <div>
                <Table maxHeight='400px'>
                    <TableHeader className='bg-gray-100 sticky top-0'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className='border-none'
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className='h-24 text-center'>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <div className='flex-1 text-sm text-muted-foreground'>
                    {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length}{' '}
                    row(s) selected.
                </div>
                <div className='space-x-2'>
                    <button>Previous</button>
                    <button>Next</button>
                </div>
            </div>
        </div>
    )
}
