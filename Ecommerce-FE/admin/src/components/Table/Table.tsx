import { ColumnDef, flexRender, getCoreRowModel, TableOptions, useReactTable } from '@tanstack/react-table'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as TableShadcn } from './TableShadcn'

type TableProps<T> = {
    data: T[]
    columns: ColumnDef<T>[]
    tableMaxHeight?: string
    className?: string
    onMouseOverInTableRow?: (orderId: string) => () => void
} & Omit<TableOptions<T>, 'getCoreRowModel'>

const Table = function <T>({ columns, data, className, tableMaxHeight }: TableProps<T>) {
    const table = useReactTable<T>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <TableShadcn className={className} maxHeight={tableMaxHeight ?? 'auto'}>
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
                        <TableRow className='border-none' key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                            Không có dữ liệu
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </TableShadcn>
    )
}

export default Table
