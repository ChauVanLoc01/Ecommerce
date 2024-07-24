import { InfoCircledIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Badge, Code, Flex, IconButton, Inset, Text, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { format, formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale'
import { BiSolidSortAlt } from 'react-icons/bi'
import Table from 'src/components/Table'
import { product_label, ProductStatus } from 'src/constants/product.status'
import { Category, Product } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

type ProductTableProps = {
    data: Product[]
    categories: { [key: string]: Category }
    onOpen: (type: 'detail' | 'update', productSelected?: Product) => () => void
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | undefined>>
}

const ProductTable = ({ data, categories, onOpen, setSelectedProduct }: ProductTableProps) => {
    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'image',
            header: () => {
                return (
                    <Flex justify={'center'} align={'center'}>
                        <div className='flex items-center gap-x-2'>
                            Hình ảnh
                            <BiSolidSortAlt />
                        </div>
                    </Flex>
                )
            },
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
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
                            loading='lazy'
                        />
                    </Inset>
                </Flex>
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
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center gap-x-2'>
                        Giá chưa giảm
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Text color='blue'>
                        {row.getValue('priceBefore') ? `${convertCurrentcy(row.getValue('priceBefore'))}` : ''}
                    </Text>
                </Flex>
            )
        },
        {
            accessorKey: 'priceAfter',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center gap-x-2'>
                        Giá sau giảm
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Text color='red'>{convertCurrentcy(row.getValue('priceAfter'))}</Text>
                </Flex>
            )
        },
        {
            accessorKey: 'currentQuantity',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center gap-x-2'>
                        Số lượng
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'} className='tabular-nums space-x-1'>
                    <Code>{convertCurrentcy(row.original.currentQuantity, false)}</Code>
                    <Text>/</Text>
                    <Code color='red'>{convertCurrentcy(row.original.initQuantity, false)}</Code>
                </Flex>
            )
        },
        {
            accessorKey: 'status',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center gap-x-2'>
                        Trạng thái
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Badge color={ProductStatus[row.getValue('status') as string] as any} size={'3'}>
                        {product_label[row.getValue('status') as keyof typeof product_label]}
                    </Badge>
                </Flex>
            )
        },
        {
            accessorKey: 'category',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center gap-x-2 max-w-15'>
                        Danh muc
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <div className='max-w-15 capitalize'>{categories[row.original.category].name}</div>
                </Flex>
            )
        },
        {
            accessorKey: 'createdAt',
            header: () => (
                <Flex justify={'center'} align={'center'}>
                    <div className='flex items-center gap-x-2'>
                        Thời gian tạo
                        <BiSolidSortAlt />
                    </div>
                </Flex>
            ),
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <div className='lowercase flex flex-col items-center'>
                        <span className='italic text-gray-400 text-[14px]'>
                            {formatDistance(row.original.createdAt, new Date().toISOString(), {
                                addSuffix: true,
                                locale: vi
                            })}
                        </span>
                        <span>{format(row.original.createdAt, 'hh:mm dd-MM-yyyy')}</span>
                    </div>
                </Flex>
            )
        },
        {
            accessorKey: ' ',
            cell: ({ row: { original } }) => (
                <Flex gapX={'2'} align={'center'}>
                    <Tooltip content='Xem chi tiết'>
                        <IconButton variant='soft' onClick={onOpen('detail', original)}>
                            <InfoCircledIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Chỉnh sửa'>
                        <IconButton
                            variant='soft'
                            color='orange'
                            disabled={['CANCEL', 'SUCCESS'].includes(original.status)}
                            onClick={onOpen('update', original)}
                        >
                            <Pencil1Icon />
                        </IconButton>
                    </Tooltip>
                </Flex>
            )
        }
    ]

    return <Table<Product> columns={columns} data={data} tableMaxHeight='500px' className='w-[1700px]' />
}

export default ProductTable
