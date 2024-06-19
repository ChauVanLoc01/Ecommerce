import { Cross2Icon, MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Box, Button, Checkbox, Flex, IconButton, Popover, Text, TextField, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import Table from 'src/components/Table'
import { Product } from 'src/types/product.type'
import { convertCurrentcy } from 'src/utils/utils'

export type ProductInFlashSaleProps = {
    products: Product[]
    onSelectChange: (product: Product) => (checked: boolean) => void
    selectedProduct: {
        products: Record<
            string,
            Product & { quantityInSale: number; priceBeforeInSale: number; priceAfterInSale: number; isExist: boolean }
        >
        size: number
    }
    setSelectedProduct: React.Dispatch<
        React.SetStateAction<{
            products: Record<
                string,
                Product & {
                    quantityInSale: number
                    priceBeforeInSale: number
                    priceAfterInSale: number
                    isExist: boolean
                }
            >
            size: number
        }>
    >
    isSelectedMode?: boolean
}

const ProductInFlashSale = ({
    products,
    onSelectChange,
    selectedProduct,
    setSelectedProduct,
    isSelectedMode = false
}: ProductInFlashSaleProps) => {
    const handleFormatCurrency = (
        e: React.ChangeEvent<HTMLInputElement>,
        productId: string,
        type: 'quantityInSale' | 'priceBeforeInSale' | 'priceAfterInSale',
        quantityMax?: number
    ) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (value || value === ' ') {
            setSelectedProduct((pre) => {
                return {
                    ...pre,
                    products: {
                        ...pre.products,
                        [productId]: {
                            ...pre.products[productId],
                            [type]: quantityMax && +value > quantityMax ? quantityMax : +value
                        }
                    }
                }
            })
        }
    }

    const columnInSelectedMode: ColumnDef<Product>[] = [
        {
            accessorKey: 'priceAfter',
            header: () => <div className='flex items-center gap-x-2'>Số lượng tham gia</div>,
            cell: ({ row }) => (
                <Box maxWidth={'80px'}>
                    <TextField.Root
                        value={
                            selectedProduct.products[row.original.id].quantityInSale
                                ? convertCurrentcy(selectedProduct.products[row.original.id].quantityInSale, false)
                                : 0
                        }
                        onChange={(e) => handleFormatCurrency(e, row.original.id, 'quantityInSale')}
                    />
                </Box>
            )
        },
        {
            accessorKey: 'priceAfter',
            header: () => <div className='flex items-center gap-x-2'>Giá sẽ giảm</div>,
            cell: ({ row }) => (
                <Box maxWidth={'150px'}>
                    <TextField.Root
                        value={convertCurrentcy(selectedProduct.products[row.original.id].priceAfterInSale)}
                        onChange={(e) => handleFormatCurrency(e, row.original.id, 'priceAfterInSale')}
                    />
                </Box>
            )
        }
    ]

    const columns: ColumnDef<Product>[] = [
        {
            accessorKey: 'image',
            header: () => {
                return (
                    <div className='flex items-center px-4'>
                        <Checkbox
                            size={'3'}
                            checked={isSelectedMode ? true : selectedProduct.size === products.length}
                        />
                    </div>
                )
            },
            cell: ({ row }) => (
                <Flex align={'center'} className='px-4'>
                    {selectedProduct.products?.[row.original.id]?.isExist ? (
                        <Tooltip content='Hủy tham gia'>
                            <IconButton color='red' size={'1'}>
                                <Cross2Icon />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Checkbox
                            size={'3'}
                            checked={!!selectedProduct.products[row.original.id]}
                            onCheckedChange={onSelectChange(row.original)}
                        />
                    )}
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
                    Giá hiện tại
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
            cell: ({ row }) => <Text color='red'>{convertCurrentcy(row.original.priceAfter)}</Text>
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

    const columnsMerged = isSelectedMode ? [...columns, ...columnInSelectedMode] : columns

    return (
        <Table<Product>
            columns={columnsMerged}
            data={products}
            tableMaxHeight='400px'
            className='w-[1300px] !max-w-[1300px]'
        />
    )
}

export default ProductInFlashSale
