import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Button, Checkbox, Flex, IconButton, Popover, Text, TextField, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import Table from 'src/components/Table'
import { Product } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

export type ProductInFlashSaleProps = {
    products: Product[]
    onSelectChange: (product: Product) => (checked: boolean) => void
    selectedProduct: {
        products: Record<string, Product>
        size: number
    }
}

const ProductInFlashSale = ({ products, onSelectChange, selectedProduct }: ProductInFlashSaleProps) => {
    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'image',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 px-4 z-50 overflow-hidden'>
                        <Checkbox size={'3'} />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'}>
                    <Checkbox
                        size={'3'}
                        checked={!!selectedProduct.products[row.original.id]}
                        onCheckedChange={onSelectChange(row.original)}
                    />
                </Flex>
            )
        },
        {
            accessorKey: 'image',
            header: () => {
                return <div className='flex items-center gap-x-2'>Hình ảnh</div>
            },
            cell: ({ row }) => (
                <Flex justify={'center'} align={'center'} p={'2'}>
                    <img
                        src={row.getValue('image')}
                        className='w-16 h-16 object-cover rounded-8'
                        alt={row.original.name}
                        loading='lazy'
                    />
                </Flex>
            )
        },
        {
            accessorKey: 'name',
            header: () => {
                return (
                    <div className='flex items-center gap-x-2 max-w-48'>
                        Tên sản phẩm
                        <Popover.Root>
                            <Popover.Trigger>
                                <IconButton size={'3'} className='text-gray-500'>
                                    <MixerHorizontalIcon />
                                </IconButton>
                            </Popover.Trigger>
                            <Popover.Content className='rounded-8' align='center'>
                                <Flex gapX={'2'}>
                                    <TextField.Root placeholder='Tìm kiếm sản phẩm...' />
                                    <Button>Tìm kiếm</Button>
                                </Flex>
                            </Popover.Content>
                        </Popover.Root>
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
            accessorKey: 'priceAfter',
            header: () => (
                <div className='flex items-center gap-x-2'>
                    Giá
                    <Popover.Root>
                        <Popover.Trigger>
                            <IconButton size={'3'} className='text-gray-500'>
                                <MixerHorizontalIcon />
                            </IconButton>
                        </Popover.Trigger>
                        <Popover.Content className='rounded-8' align='center'>
                            <Flex gapX={'2'}>
                                <TextField.Root placeholder='Tìm kiếm sản phẩm...' />
                                <Button>Tìm kiếm</Button>
                            </Flex>
                        </Popover.Content>
                    </Popover.Root>
                </div>
            ),
            cell: ({ row }) => <Text color='red'>{convertCurrentcy(row.getValue('priceAfter'))}</Text>
        },
        {
            accessorKey: 'currentQuantity',
            header: () => (
                <div className='flex items-center gap-x-2'>
                    Số lượng hiện tại
                    <Popover.Root>
                        <Popover.Trigger>
                            <IconButton size={'3'} className='text-gray-500'>
                                <MixerHorizontalIcon />
                            </IconButton>
                        </Popover.Trigger>
                        <Popover.Content className='rounded-8' align='center'>
                            <Flex gapX={'2'}>
                                <TextField.Root placeholder='Tìm kiếm sản phẩm...' />
                                <Button>Tìm kiếm</Button>
                            </Flex>
                        </Popover.Content>
                    </Popover.Root>
                </div>
            ),
            cell: ({ row }) => <Text>{convertCurrentcy(row.getValue('currentQuantity'), false)}</Text>
        }
    ]
    return <Table<Product> columns={columns} data={products} tableMaxHeight='400px' className='w-[1000px]'></Table>
}

export default ProductInFlashSale
