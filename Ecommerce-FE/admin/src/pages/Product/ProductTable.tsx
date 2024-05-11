import { Cross2Icon, InfoCircledIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Badge, Flex, IconButton, Inset, Text, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { ProductStatus } from 'src/constants/product.status'
import { Category, Product } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

type ProductTableProps = {
    data: Product[]
    categories: { [key: string]: Category }
}

const ProductTable = ({ data, categories }: ProductTableProps) => {
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
                    {row.getValue('priceBefore') ? `${convertCurrentcy(row.getValue('priceBefore'))}` : ''}
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
            cell: ({ row }) => <Text>{convertCurrentcy(row.getValue('currentQuantity'), false)}</Text>
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
            cell: ({ row }) => <div className='lowercase max-w-15'>{categories[row.original.category].name}</div>
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
                    <span className='italic text-gray-400 text-[14px]'>
                        {formatDistance(row.original.createdAt, new Date().toISOString(), {
                            addSuffix: true,
                            locale: vi
                        })}
                    </span>
                    <span>{format(row.original.createdAt, 'hh:mm dd-MM-yyyy')}</span>
                </div>
            )
        },
        {
            accessorKey: ' ',
            cell: ({ row }) => (
                <Flex gapX={'2'} align={'center'}>
                    <Tooltip content='Xem chi tiết'>
                        <IconButton variant='soft'>
                            <InfoCircledIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Chỉnh sửa'>
                        <IconButton
                            variant='soft'
                            color='orange'
                            disabled={['CANCEL', 'SUCCESS'].includes(row.original.status)}
                        >
                            <Pencil1Icon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Hủy đơn'>
                        <IconButton
                            variant='soft'
                            color='red'
                            disabled={['CANCEL', 'SUCCESS'].includes(row.original.status)}
                        >
                            <Cross2Icon />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    return <Table<Product> columns={columns} data={data} className='!w-[1700px]' tableMaxHeight='500px' />
}

export default ProductTable
