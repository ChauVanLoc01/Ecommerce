import { Box, Checkbox, Code, Flex, Text, TextField, Tooltip } from '@radix-ui/themes'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import Table from 'src/components/Table'
import { Product } from 'src/types/product.type'
import { ProductSaleMix } from 'src/types/sale.type'
import { convertCurrentcy } from 'src/utils/utils'
import { JoinedProduct, ProductSelected } from './FlashSale'

export type ProductInFlashSaleProps = {
    products: ProductSaleMix[]
    onSelectChange: (product: Product) => (checked: boolean) => void
    selectedProduct: ProductSelected
    setSelectedProduct: React.Dispatch<React.SetStateAction<ProductSelected>>
    tab: number
    joinedProduct: JoinedProduct
    handleCheckedAndUncheckedAll: (checked: boolean) => () => void
    onCheckedJoinProduct: (productId: string, checked: boolean) => () => void
    setJoinedProduct: React.Dispatch<React.SetStateAction<JoinedProduct>>
    valueRef: React.MutableRefObject<
        | {
              productId: string
              value: number
              mode: 'checked' | 'created'
              type: 'quantityInSale' | 'priceAfterInSale'
          }
        | undefined
    >
    handleFocusOut: () => void
}

const ProductInFlashSale = ({
    products,
    onSelectChange,
    selectedProduct,
    setSelectedProduct,
    tab,
    joinedProduct,
    handleCheckedAndUncheckedAll,
    onCheckedJoinProduct,
    setJoinedProduct,
    valueRef,
    handleFocusOut
}: ProductInFlashSaleProps) => {
    const handleFormatCurrency = (
        e: React.ChangeEvent<HTMLInputElement>,
        productId: string,
        mode: 'created' | 'checked',
        type: 'quantityInSale' | 'priceAfterInSale',
        quantityMax?: number
    ) => {
        var value = e.target.value.replace(/[^0-9]/g, '')
        value = !!value ? value : '0'

        valueRef.current = {
            productId,
            value: type === 'quantityInSale' ? Math.min(+value, quantityMax as number) : +value,
            mode,
            type
        }

        document.removeEventListener('focus', handleFocusOut)
        document.addEventListener('focus', handleFocusOut)
    }

    const columns = useMemo(() => {
        let isCheckedAll = [
            products.length === selectedProduct.size,
            !!selectedProduct.size,
            joinedProduct.checked === joinedProduct.size
        ][tab]

        let columnInSelectedMode: ColumnDef<ProductSaleMix>[] = []
        let columns: ColumnDef<ProductSaleMix>[] = [
            {
                accessorKey: 'checked',
                header: () => {
                    return (
                        <div className='flex items-center px-4'>
                            <Checkbox
                                size={'3'}
                                checked={isCheckedAll}
                                onCheckedChange={handleCheckedAndUncheckedAll(!isCheckedAll)}
                            />
                        </div>
                    )
                },
                cell: ({ row }) => (
                    <Flex align={'center'} className='px-4'>
                        <Checkbox
                            size={'3'}
                            checked={
                                tab === 2
                                    ? row.original.isChecked
                                    : !!selectedProduct.products[row.original.id]?.isChecked
                            }
                            onCheckedChange={
                                tab === 2
                                    ? onCheckedJoinProduct(row.original.id, !row.original.isChecked)
                                    : onSelectChange(row.original)
                            }
                        />
                    </Flex>
                )
            },
            {
                accessorKey: 'image',
                header: () => {
                    return (
                        <Flex justify={'center'} align={'center'}>
                            Hình ảnh
                        </Flex>
                    )
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
                    return <div>Tên sản phẩm</div>
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
                    <Flex justify={'center'} align={'center'}>
                        <Text>Giá hiện tại</Text>
                    </Flex>
                ),
                cell: ({ row }) => (
                    <Flex justify={'center'} align={'center'}>
                        <Text color='red'>{convertCurrentcy(row.original.priceAfter)}</Text>
                    </Flex>
                )
            },
            {
                accessorKey: 'currentQuantity',
                header: () => (
                    <Flex justify={'center'} align={'center'}>
                        <Text>Số lượng hiện tại</Text>
                    </Flex>
                ),
                cell: ({ row }) => (
                    <Flex justify={'center'} align={'center'} className='tabular-nums space-x-1'>
                        <Code>{convertCurrentcy(row.original.currentQuantity, false)}</Code>
                        <Text>/</Text>
                        <Code color='red'>{convertCurrentcy(row.original.initQuantity, false)}</Code>
                    </Flex>
                )
            }
        ]

        if (tab > 0) {
            let mode = ['checked', 'created'][tab - 1]
            columnInSelectedMode = [
                {
                    accessorKey: 'priceAfter',
                    header: () => (
                        <Flex justify={'center'} align={'center'}>
                            Số lượng tham gia
                        </Flex>
                    ),
                    cell: ({ row }) => (
                        <Flex justify={'center'} align={'center'}>
                            <Box maxWidth={'120px'}>
                                <TextField.Root
                                    defaultValue={
                                        tab === 2
                                            ? convertCurrentcy(
                                                  joinedProduct?.products?.[row.original.id]?.quantityInSale || 0,
                                                  false
                                              )
                                            : convertCurrentcy(
                                                  selectedProduct.products?.[row.original.id]?.quantityInSale || 0,
                                                  false
                                              )
                                    }
                                    onChange={(e) =>
                                        handleFormatCurrency(
                                            e,
                                            row.original.id,
                                            mode as any,
                                            'quantityInSale',
                                            tab === 2
                                                ? joinedProduct.products[row.original.id].currentQuantity
                                                : selectedProduct.products?.[row.original.id]?.currentQuantity
                                        )
                                    }
                                    onBlur={handleFocusOut}
                                />
                            </Box>
                        </Flex>
                    )
                },
                {
                    accessorKey: 'priceAfter',
                    header: () => (
                        <Flex justify={'center'} align={'center'}>
                            Giá sẽ giảm
                        </Flex>
                    ),
                    cell: ({ row }) => (
                        <Flex justify={'center'} align={'center'}>
                            <Box maxWidth={'150px'}>
                                <TextField.Root
                                    defaultValue={
                                        tab === 2
                                            ? convertCurrentcy(
                                                  joinedProduct?.products?.[row.original.id]?.priceAfterInSale || 0
                                              )
                                            : convertCurrentcy(
                                                  selectedProduct.products?.[row.original.id]?.priceAfterInSale || 0
                                              )
                                    }
                                    onChange={(e) =>
                                        handleFormatCurrency(e, row.original.id, mode as any, 'priceAfterInSale')
                                    }
                                    onBlur={handleFocusOut}
                                />
                            </Box>
                        </Flex>
                    )
                }
            ]
        }

        let columnsMerged = [...columns, ...columnInSelectedMode]

        return [columns, columnsMerged, columnsMerged][tab]
    }, [tab, selectedProduct, joinedProduct])

    return <Table<ProductSaleMix> columns={columns} data={products} tableMaxHeight='400px' />
}

export default ProductInFlashSale
