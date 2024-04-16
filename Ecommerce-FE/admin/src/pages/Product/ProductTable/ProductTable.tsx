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

import { Badge, Button, DropdownMenu, Inset } from '@radix-ui/themes'
import { format } from 'date-fns'
import { useLoaderData } from 'react-router-dom'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/Table/Table'
import { ProductStatus } from 'src/constants/product.status'
import useQueryParams from 'src/hooks/useQueryParams'
import { Product, ProductQueryAndPagination } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'image',
        header: () => {
            return (
                <div className='flex items-center gap-x-2'>
                    Hình ảnh
                    <BiSolidSortAlt />
                </div>
            )
        },
        cell: ({ row }) => (
            <Inset clip='padding-box' side='top' pb='current' className='rounded-8 w-14 h-14 object-cover'>
                <img
                    src={row.getValue('image')}
                    alt='Bold typography'
                    style={{
                        display: 'block',
                        objectFit: 'cover',
                        width: '100%',
                        height: 140,
                        backgroundColor: 'var(--gray-5)'
                    }}
                />
            </Inset>
        )
    },
    {
        accessorKey: 'name',
        header: () => {
            return (
                <div className='flex items-center gap-x-2'>
                    Tên sản phẩm
                    <BiSolidSortAlt />
                </div>
            )
        },
        cell: ({ row }) => <div className='capitalize max-w-40 line-clamp-3'>{row.getValue('name')}</div>
    },
    {
        accessorKey: 'priceBefore',
        header: () => (
            <div className='flex items-center gap-x-2'>
                Giá chưa giảm
                <BiSolidSortAlt />
            </div>
        ),
        cell: ({ row }) => <div className='lowercase'>{convertCurrentcy(row.getValue('priceBefore'))}đ</div>
    },
    {
        accessorKey: 'priceAfter',
        header: () => (
            <div className='flex items-center gap-x-2'>
                Giá sau giảm
                <BiSolidSortAlt />
            </div>
        ),
        cell: ({ row }) => <div className='lowercase'>{convertCurrentcy(row.getValue('priceAfter'))}đ</div>
    },
    {
        accessorKey: 'quantity',
        header: () => (
            <div className='flex items-center gap-x-2'>
                Số lượng
                <BiSolidSortAlt />
            </div>
        ),
        cell: ({ row }) => <div className='lowercase'>{convertCurrentcy(row.getValue('priceAfter'))}</div>
    },
    {
        accessorKey: 'status',
        header: () => (
            <div className='flex items-center gap-x-2'>
                Trạng thái
                <BiSolidSortAlt />
            </div>
        ),
        cell: ({ row }) => (
            <Badge color={ProductStatus[row.getValue('status') as string] as any}>{row.getValue('status')}</Badge>
        )
    },
    {
        accessorKey: 'category',
        header: () => (
            <div className='flex items-center gap-x-2'>
                Danh muc
                <BiSolidSortAlt />
            </div>
        ),
        cell: ({ row }) => <div className='lowercase'>{row.getValue('category')}</div>
    },
    {
        accessorKey: 'createdAt',
        header: () => (
            <div className='flex items-center gap-x-2'>
                Thời gian tạo
                <BiSolidSortAlt />
            </div>
        ),
        cell: ({ row }) => (
            <div className='lowercase flex flex-col items-center'>
                <span>{format(row.getValue('createdAt'), 'hh:mm')}</span>
                <span>{format(row.getValue('createdAt'), 'dd-MM-yyyy')}</span>
            </div>
        )
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
                    <DropdownMenu.Content className='!rounded-8'>
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

export function ProductTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const [query, _] = useQueryParams<ProductQueryAndPagination>()
    const [data, { page, page_size }] = useLoaderData() as [Product[], { page: number; page_size: number }]

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
        },
        rowCount: 21
    })

    return (
        <div className='w-full text-gray-700'>
            <div>
                <Table maxHeight='400px'>
                    <TableHeader className='bg-gray-100 sticky top-0 !text-gray-600'>
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
        </div>
    )
}
