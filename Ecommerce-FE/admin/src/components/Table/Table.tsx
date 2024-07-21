import { ColumnDef, flexRender, getCoreRowModel, TableOptions, useReactTable } from '@tanstack/react-table'
import { twMerge } from 'tailwind-merge'
import { v4 as uuid } from 'uuid'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as TableShadcn } from './TableShadcn'

type TableProps<T> = {
    id?: string
    data: T[]
    columns: ColumnDef<T>[]
    tableMaxHeight?: string
    className?: string
    usingSimpleBar?: boolean
    onMouseOverInTableRow?: (orderId: string) => () => void
} & Omit<TableOptions<T>, 'getCoreRowModel'>

const Table = function <T>({ columns, id, data, className, tableMaxHeight, usingSimpleBar = true }: TableProps<T>) {
    const table = useReactTable<T>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <TableShadcn
            id={id}
            className={twMerge('min-w-full', className)}
            maxHeight={tableMaxHeight ?? 'auto'}
            usingSimpleBar={usingSimpleBar}
        >
            <TableHeader className='bg-gray-100 sticky top-0 z-50 overflow-hidden'>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={uuid()}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={uuid()}>
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
                        <TableRow className='border-none' key={uuid()} data-state={row.getIsSelected() && 'selected'}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={uuid()}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className='h-24 text-center'>
                            Không có dữ liệu
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </TableShadcn>
    )
}

export default Table
