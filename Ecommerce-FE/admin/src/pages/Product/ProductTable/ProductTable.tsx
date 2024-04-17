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

import { Badge, ContextMenu, Inset, Tooltip } from '@radix-ui/themes'
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
            <Inset clip='padding-box' side='top' pb='current' className='rounded-8 w-16 h-16 object-cover'>
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
                <div className='flex items-center gap-x-2 max-w-48'>
                    Tên sản phẩm
                    <BiSolidSortAlt />
                </div>
            )
        },
        cell: ({ row }) => (
            <Tooltip content={row.getValue('name')}>
                <div className='capitalize line-clamp-3 max-w-48'>{row.getValue('name')}</div>
            </Tooltip>
        )
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
            <div className='flex items-center gap-x-2 max-w-15'>
                Danh muc
                <BiSolidSortAlt />
            </div>
        ),
        cell: ({ row }) => <div className='lowercase max-w-15'>{row.getValue('category')}</div>
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
        rowCount: 21,
        manualPagination: true
    })

    return (
        <div className='w-full text-gray-700'>
            <div>
                <Table maxHeight='550px' className='w-[1500px]'>
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
                                        <ContextMenu.Root>
                                            <ContextMenu.Trigger>
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            </ContextMenu.Trigger>
                                            <ContextMenu.Content className='rounded-8'>
                                                <ContextMenu.Item color='red'>Xóa</ContextMenu.Item>
                                                <ContextMenu.Item>Chi tiết</ContextMenu.Item>
                                                <ContextMenu.Item color='cyan'>Chỉnh sửa</ContextMenu.Item>
                                            </ContextMenu.Content>
                                        </ContextMenu.Root>
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
