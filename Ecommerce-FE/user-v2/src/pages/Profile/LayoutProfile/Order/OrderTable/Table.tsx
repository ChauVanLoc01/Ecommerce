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
import { AiOutlineEye } from 'react-icons/ai'
import { BiSolidSortAlt } from 'react-icons/bi'
import { IoSearchOutline } from 'react-icons/io5'
import { MdOutlineArrowDropDown } from 'react-icons/md'

import InputIcon from 'src/components/InputIcon'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from 'src/components/Shadcn/dialog'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from 'src/components/Shadcn/dropdown-menu'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from 'src/components/Shadcn/table'

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
        cell: ({ row }) => (
            <div className='capitalize'>{row.getValue('status')}</div>
        )
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
        cell: ({ row }) => (
            <div className='lowercase'>{row.getValue('email')}</div>
        )
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
                <Dialog>
                    <DialogTrigger className='text-gray-500 hover:text-blue-600'>
                        <AiOutlineEye />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )
        }
    }
]

export function OrderTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
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
                <DropdownMenu>
                    <DropdownMenuTrigger
                        className='rounded-8 border border-border/30 px-4 py-2.5'
                        asChild
                    >
                        <button className='flex items-center ml-auto space-x-2'>
                            <span>Thêm cột</span>{' '}
                            <MdOutlineArrowDropDown size={22} />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='border-border/30'
                        align='end'
                    >
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className='capitalize pl-7'
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className='rounded-none'>
                <Table>
                    <TableHeader className='bg-gray-100 sticky top-0'>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
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
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className='flex items-center justify-end space-x-2 py-4'>
                <div className='flex-1 text-sm text-muted-foreground'>
                    {table.getFilteredSelectedRowModel().rows.length} of{' '}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className='space-x-2'>
                    <button>Previous</button>
                    <button>Next</button>
                </div>
            </div>
        </div>
    )
}
