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

import {
    Avatar,
    Badge,
    Button,
    Code,
    ContextMenu,
    DataList,
    Dialog,
    Flex,
    IconButton,
    Inset,
    Select,
    Text,
    TextArea,
    TextField,
    Tooltip
} from '@radix-ui/themes'
import { AxiosResponse } from 'axios'
import { format } from 'date-fns'
import { CopyIcon } from 'lucide-react'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/Table/Table'
import { ProductStatus } from 'src/constants/product.status'
import { queryClient } from 'src/routes/main.route'
import { Category, CategoryResponse, Product, ProductListResponse } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

type ProductTableProps = {
    data: ProductListResponse
}

export function ProductTable({ data }: ProductTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const categoriesResponse = queryClient.getQueryData(['categories']) as AxiosResponse<CategoryResponse>

    const categories: { [key: string]: Category } = categoriesResponse.data.result.reduce((acum, category) => {
        return { ...acum, [category.shortname]: category }
    }, {})

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
            cell: ({ row }) => (
                <div className='lowercase max-w-15'>{categories[row.getValue('category') as string].name}</div>
            )
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
                                                <Dialog.Root>
                                                    <Dialog.Trigger>
                                                        <ContextMenu.Item
                                                            className='hover:bg-red hover:text-white text-gray-600'
                                                            onSelect={(e) => e.preventDefault()}
                                                        >
                                                            Xóa
                                                        </ContextMenu.Item>
                                                    </Dialog.Trigger>
                                                    <Dialog.Content maxWidth='450px' className='rounded-8'>
                                                        <Dialog.Title>Xác nhận xóa sản phẩm</Dialog.Title>
                                                        <Dialog.Description size='2' mb='4'>
                                                            Sản phẩm sẽ không thật sự xóa. Bạn vẫn có thể khôi phục lại
                                                            sản phẩm này
                                                        </Dialog.Description>
                                                        <Flex gapX='3' justify='end'>
                                                            <Dialog.Close>
                                                                <Button variant='outline' color='red'>
                                                                    Hủy
                                                                </Button>
                                                            </Dialog.Close>
                                                            <Button color='blue'>Xác nhận</Button>
                                                        </Flex>
                                                    </Dialog.Content>
                                                </Dialog.Root>
                                                <Dialog.Root>
                                                    <Dialog.Trigger>
                                                        <ContextMenu.Item
                                                            className='hover:bg-blue hover:text-white text-gray-600'
                                                            onSelect={(e) => e.preventDefault()}
                                                        >
                                                            Chi tiết
                                                        </ContextMenu.Item>
                                                    </Dialog.Trigger>
                                                    <Dialog.Content maxWidth='800px' className='rounded-8 space-y-5'>
                                                        <Dialog.Title>Thông tin chi tiết sản phẩm</Dialog.Title>
                                                        <Flex gapX={'5'}>
                                                            <Avatar
                                                                src={row.original.image}
                                                                fallback={'IMG'}
                                                                size={'9'}
                                                                radius='small'
                                                            />
                                                            <DataList.Root>
                                                                <DataList.Item align='start'>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Tên sản phẩm
                                                                    </DataList.Label>
                                                                    <DataList.Value>{row.original.name}</DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Mã sản phẩm
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <Flex align='center' gap='2'>
                                                                            <Code
                                                                                variant='ghost'
                                                                                className='line-clamp-1'
                                                                            >
                                                                                {row.original.id}
                                                                            </Code>
                                                                            <IconButton
                                                                                size='1'
                                                                                aria-label='Copy value'
                                                                                color='gray'
                                                                                variant='ghost'
                                                                            >
                                                                                <CopyIcon />
                                                                            </IconButton>
                                                                        </Flex>
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Trạng thái
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <Badge color='green' size={'3'}>
                                                                            {row.original.status}
                                                                        </Badge>
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Danh mục
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {categories[row.original.category].name}
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Giá hiện tại
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {convertCurrentcy(row.original.priceAfter)}đ
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Giá trước đó
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {convertCurrentcy(row.original.priceBefore)}đ
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Số lượng còn lại
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {convertCurrentcy(row.original.currentQuantity)}
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Số lượng đã bán
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {convertCurrentcy(row.original.sold)}
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Số lượng ban đầu
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {convertCurrentcy(row.original.initQuantity)}
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Số sao đánh giá
                                                                    </DataList.Label>
                                                                    <DataList.Value>{row.original.rate}</DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Thời gian tạo
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {format(
                                                                            row.original.createdAt,
                                                                            'hh:mm - dd/LL/y'
                                                                        )}
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                            </DataList.Root>
                                                        </Flex>
                                                    </Dialog.Content>
                                                </Dialog.Root>
                                                <Dialog.Root>
                                                    <Dialog.Trigger>
                                                        <ContextMenu.Item
                                                            className='hover:bg-orange-500 hover:text-white text-gray-600'
                                                            onSelect={(e) => e.preventDefault()}
                                                        >
                                                            Chỉnh sửa
                                                        </ContextMenu.Item>
                                                    </Dialog.Trigger>
                                                    <Dialog.Content maxWidth='800px' className='rounded-8'>
                                                        <Dialog.Title className='mb-7'>
                                                            Cập nhật thông tin sản phẩm
                                                        </Dialog.Title>
                                                        <Flex gapX={'5'}>
                                                            <Avatar
                                                                src={row.original.image}
                                                                fallback={'IMG'}
                                                                size={'9'}
                                                                radius='small'
                                                            />
                                                            <DataList.Root>
                                                                <DataList.Item align='start'>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Tên sản phẩm
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <TextArea className='flex-grow'>
                                                                            {row.original.name}
                                                                        </TextArea>
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Mã sản phẩm
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <Flex align='center' gap='2'>
                                                                            <Code
                                                                                variant='ghost'
                                                                                className='line-clamp-1'
                                                                            >
                                                                                {row.original.id}
                                                                            </Code>
                                                                            <IconButton
                                                                                size='1'
                                                                                aria-label='Copy value'
                                                                                color='gray'
                                                                                variant='ghost'
                                                                            >
                                                                                <CopyIcon />
                                                                            </IconButton>
                                                                        </Flex>
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Trạng thái
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <Flex direction='column' width='140px'>
                                                                            <Select.Root
                                                                                defaultValue={row.original.status}
                                                                            >
                                                                                <Select.Trigger />
                                                                                <Select.Content
                                                                                    position='popper'
                                                                                    className='rounded-6'
                                                                                >
                                                                                    <Select.Item value='ACTIVE'>
                                                                                        ACTIVE
                                                                                    </Select.Item>
                                                                                    <Select.Item value='BLOCK'>
                                                                                        BLOCK
                                                                                    </Select.Item>
                                                                                </Select.Content>
                                                                            </Select.Root>
                                                                        </Flex>
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Danh mục
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {categories[row.original.category].name}
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Giá hiện tại
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <TextField.Root
                                                                            type='number'
                                                                            defaultValue={row.original.priceAfter}
                                                                        />
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Giá trước đó
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <TextField.Root
                                                                            type='number'
                                                                            defaultValue={row.original.priceBefore}
                                                                        />
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Số lượng còn lại
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <TextField.Root
                                                                            type='number'
                                                                            defaultValue={row.original.currentQuantity}
                                                                        />
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Số lượng đã bán
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <TextField.Root
                                                                            type='number'
                                                                            defaultValue={row.original.sold}
                                                                        />
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Số lượng ban đầu
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        <TextField.Root
                                                                            type='number'
                                                                            defaultValue={row.original.initQuantity}
                                                                        />
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Số sao đánh giá
                                                                    </DataList.Label>
                                                                    <DataList.Value>{row.original.rate}</DataList.Value>
                                                                </DataList.Item>
                                                                <DataList.Item>
                                                                    <DataList.Label minWidth='95px'>
                                                                        Thời gian tạo
                                                                    </DataList.Label>
                                                                    <DataList.Value>
                                                                        {format(
                                                                            row.original.createdAt,
                                                                            'hh:mm - dd/LL/y'
                                                                        )}
                                                                    </DataList.Value>
                                                                </DataList.Item>
                                                            </DataList.Root>
                                                        </Flex>
                                                        <Flex justify={'end'} gapX={'3'}>
                                                            <Dialog.Close>
                                                                <Button variant='outline' color='red'>
                                                                    Hủy
                                                                </Button>
                                                            </Dialog.Close>
                                                            <Button color='blue'>Thay đổi</Button>
                                                        </Flex>
                                                    </Dialog.Content>
                                                </Dialog.Root>
                                            </ContextMenu.Content>
                                        </ContextMenu.Root>
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
