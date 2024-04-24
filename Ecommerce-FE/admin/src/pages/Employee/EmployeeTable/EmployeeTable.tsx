import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { BiSolidSortAlt } from 'react-icons/bi'

import { Badge, Inset, Text, Tooltip } from '@radix-ui/themes'
import { format } from 'date-fns'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/Table/Table'
import { ProductStatus } from 'src/constants/product.status'
import { Product } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

export function EmployeeTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Product>[] = [
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
          <div className='capitalize line-clamp-2 max-w-48'>{row.getValue('name')}</div>
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
      cell: ({ row }) => (
        <Text color='blue'>
          {row.getValue('priceBefore') ? `${convertCurrentcy(row.getValue('priceBefore'))}đ` : ''}
        </Text>
      )
    },
    {
      accessorKey: 'priceAfter',
      header: () => (
        <div className='flex items-center gap-x-2'>
          Giá sau giảm
          <BiSolidSortAlt />
        </div>
      ),
      cell: ({ row }) => <Text color='red'>{convertCurrentcy(row.getValue('priceAfter'))}</Text>
    },
    {
      accessorKey: 'currentQuantity',
      header: () => (
        <div className='flex items-center gap-x-2'>
          Số lượng
          <BiSolidSortAlt />
        </div>
      ),
      cell: ({ row }) => <Text>{convertCurrentcy(row.getValue('currentQuantity'))}</Text>
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
      cell: ({ row }) => <div className='lowercase max-w-15'>{categories[row.getValue('category') as string].name}</div>
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

  const table = useReactTable({
    data: data.result.data,
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
    rowCount: data.result.query.limit,
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className='border-none' key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  Không có sản phẩm
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
