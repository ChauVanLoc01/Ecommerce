import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import {
    AlertDialog,
    Button,
    DataList,
    Flex,
    IconButton,
    Portal,
    SegmentedControl,
    Select,
    Spinner,
    Text,
    TextField
} from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation, useQuery } from '@tanstack/react-query'
import { format, formatDistance, sub } from 'date-fns'
import { Dictionary } from 'lodash'
import { toast } from 'sonner'
import { ProductApi } from 'src/apis/product.api'
import { sale_api } from 'src/apis/sale.api'
import { formatDefault } from 'src/constants/date.constants'
import { Product } from 'src/types/product.type'
import { ProductSaleMix, SalePromotion, StoreWithProductSalePromotion } from 'src/types/sale.type'
import { JoinedProduct, ProductSelected } from './FlashSale'
import ProductInFlashSale from './ProductInFlashSale'

type SaleAlertProps = {
    selectedEvent: {
        open: boolean
        event?: SalePromotion
    }
    setSelectedEvent: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            event?: SalePromotion
        }>
    >
    selectedProduct: ProductSelected
    setSelectedProduct: React.Dispatch<React.SetStateAction<ProductSelected>>
    productTab: ProductSaleMix[]
    refetchSalePromotion: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                promotionObjs: Dictionary<SalePromotion>
                storePromotionObj: Dictionary<StoreWithProductSalePromotion>
            },
            Error
        >
    >
    handleUpdateProduct: () => void
    isJoin: boolean
    onClear: () => void
    joinedProduct: JoinedProduct
    setJoinedProduct: React.Dispatch<React.SetStateAction<JoinedProduct>>
    tab: number
    setTab: React.Dispatch<React.SetStateAction<number>>
    storePromotionObj: Dictionary<StoreWithProductSalePromotion>
    valueRef: React.MutableRefObject<
        | {
              productId: string
              value: number
              mode: 'checked' | 'created'
              type: 'quantityInSale' | 'priceAfterInSale'
          }
        | undefined
    >
    category: string | undefined
    page: number
    handleClear: () => void
    handleCategory: (category: string) => void
    handlePreviousPage: () => void
    handleNextPage: () => void
    page_size: number
    search_key: string
    handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SaleAlert = ({
    selectedEvent,
    setSelectedEvent,
    selectedProduct,
    setSelectedProduct,
    productTab,
    refetchSalePromotion,
    handleUpdateProduct,
    isJoin,
    onClear,
    joinedProduct,
    setJoinedProduct,
    setTab,
    tab,
    storePromotionObj,
    valueRef,
    category,
    page,
    handleCategory,
    handleClear,
    handleNextPage,
    handlePreviousPage,
    page_size,
    handleSearch,
    search_key
}: SaleAlertProps) => {
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: ProductApi.getAllCategories,
        staleTime: Infinity,
        select: (data) => data.data.result
    })

    const { mutate: joinSalePromotion, isPending } = useMutation({
        mutationFn: sale_api.joinSalePromotion,
        onSuccess: () => {
            refetchSalePromotion()
            onClear()
            setSelectedEvent((pre) => ({ ...pre, open: false }))
            toast.success('Tham gia thành công')
        }
    })

    const handleChangeTab = (value: string) => setTab(+value)

    const onChecked = (product: Product) => (checked: boolean) => {
        if (checked) {
            setSelectedProduct((pre) => {
                return {
                    products: {
                        ...pre.products,
                        [product.id]: {
                            ...product,
                            priceAfterInSale: 0,
                            priceBeforeInSale: 0,
                            quantityInSale: 0,
                            isChecked: true
                        }
                    },
                    size: pre.size + 1
                }
            })
        } else {
            setSelectedProduct((pre) => {
                delete pre.products[product.id]
                return {
                    ...pre,
                    size: pre.size - 1
                }
            })
        }
    }

    const onCheckedJoinProduct = (productId: string, checked: boolean) => () => {
        setJoinedProduct((pre) => ({
            ...pre,
            products: {
                ...pre.products,
                [productId]: {
                    ...pre.products[productId],
                    isChecked: checked
                }
            },
            checked: checked ? pre.size + 1 : pre.size - 1
        }))
    }

    const handleCheckedAndUncheckedAll = (checked: boolean) => () => {
        if (tab < 2) {
            if (tab === 0) {
                if (checked) {
                    setSelectedProduct({
                        products: productTab.reduce((acum, e) => {
                            return {
                                ...acum,
                                [e.id]: {
                                    ...e,
                                    isChecked: checked
                                }
                            }
                        }, {}),
                        size: productTab.length
                    })
                } else {
                    setSelectedProduct({ products: {}, size: 0 })
                }
            } else {
                !checked && setSelectedProduct({ products: {}, size: 0 })
            }
            return
        }
        setJoinedProduct((pre) => ({
            ...pre,
            products: Object.keys(pre.products).reduce((acum, key) => {
                return {
                    ...acum,
                    [key]: {
                        ...pre.products[key],
                        isChecked: checked
                    }
                }
            }, {}),
            checked: checked ? pre.size : 0
        }))
    }

    const handleJoin = (storePromotionId?: string) => () => {
        if (!selectedProduct.size) {
            toast.warning('Chưa thêm sản phẩm nào vào chương trình')
            return
        }

        let isOk = Object.values(selectedProduct.products).every((e) => e.quantityInSale && e.priceAfterInSale)

        if (!isOk) {
            toast.warning('Số lượng tham gia và giá phải lớn hơn 0')
            return
        }

        joinSalePromotion({
            salePromotionId: (selectedEvent.event as SalePromotion).id,
            storePromotionId,
            products: Object.keys(selectedProduct.products).map((e) => ({
                name: selectedProduct.products[e].name,
                image: selectedProduct.products[e].image,
                productId: e,
                priceAfter: selectedProduct.products[e].priceAfterInSale,
                quantity: selectedProduct.products[e].quantityInSale
            }))
        })
    }

    const handleFocusOut = () => {
        if (!valueRef?.current) {
            return
        }
        let { mode, productId, type, value } = valueRef?.current
        if (mode === 'checked') {
            setSelectedProduct((pre) => ({
                ...pre,
                products: {
                    ...pre.products,
                    [productId]: {
                        ...pre.products[productId],
                        [type]: value
                    }
                }
            }))
        } else {
            setJoinedProduct((pre) => ({
                ...pre,
                products: {
                    ...pre.products,
                    [productId]: {
                        ...pre.products[productId],
                        [type]: value
                    }
                }
            }))
        }
        valueRef.current = undefined
        document.removeEventListener('focus', handleFocusOut)
    }

    return (
        selectedEvent.open &&
        (selectedEvent?.event as SalePromotion) && (
            <Portal>
                <AlertDialog.Root
                    open={selectedEvent.open}
                    onOpenChange={(open) => setSelectedEvent((pre) => ({ ...pre, open }))}
                >
                    <AlertDialog.Content className='rounded-8' maxWidth='1400px'>
                        <AlertDialog.Title>Tham gia sự kiện</AlertDialog.Title>
                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label>Tên sự kiện</DataList.Label>
                                <DataList.Value className='items-center'>
                                    <Flex gapX={'2'}>
                                        <Text>{(selectedEvent.event as SalePromotion).title}</Text>
                                        {isJoin && (
                                            <Text className='italic' color='gray'>
                                                (Đã tham gia:{' '}
                                                {formatDistance(
                                                    new Date(),
                                                    (selectedEvent.event as SalePromotion).createdAt
                                                )}
                                                )
                                            </Text>
                                        )}
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Trạng thái</DataList.Label>
                                <DataList.Value className='items-center'>
                                    <Text>Sắp diễn ra</Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Bắt đầu</DataList.Label>
                                <DataList.Value className='items-center'>
                                    <Text>
                                        {format(
                                            sub((selectedEvent.event as SalePromotion).startDate, { hours: 7 }),
                                            formatDefault
                                        )}
                                        ({formatDistance(new Date(), (selectedEvent.event as SalePromotion).endDate)})
                                    </Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Kết thúc</DataList.Label>
                                <DataList.Value className='items-center'>
                                    <Text>
                                        {format(
                                            sub((selectedEvent.event as SalePromotion).endDate, { hours: 7 }),
                                            formatDefault
                                        )}
                                    </Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item className='!flex !flex-col'>
                                <DataList.Label>
                                    <SegmentedControl.Root defaultValue='0' size={'2'} onValueChange={handleChangeTab}>
                                        <SegmentedControl.Item value='0'>Tổng</SegmentedControl.Item>
                                        <SegmentedControl.Item value='1'>
                                            Đã chọn ({selectedProduct.size})
                                        </SegmentedControl.Item>
                                        {isJoin && (
                                            <SegmentedControl.Item value='2'>
                                                Đã tham gia ({joinedProduct.size})
                                            </SegmentedControl.Item>
                                        )}
                                    </SegmentedControl.Root>
                                </DataList.Label>
                                <DataList.Value className='items-center w-full'>
                                    <Flex gapY={'3'} direction={'column'} className='flex-grow'>
                                        {tab == 0 && (
                                            <Flex justify={'between'} align={'center'}>
                                                <Flex align={'center'} gapX={'4'}>
                                                    <TextField.Root
                                                        placeholder='Tìm kiếm sản phẩm'
                                                        size='3'
                                                        value={search_key}
                                                        onChange={handleSearch}
                                                    >
                                                        <TextField.Slot>
                                                            <MagnifyingGlassIcon />
                                                        </TextField.Slot>
                                                    </TextField.Root>
                                                    <Select.Root
                                                        size={'3'}
                                                        value={category}
                                                        onValueChange={handleCategory}
                                                    >
                                                        <Select.Trigger placeholder='Chọn danh mục' />
                                                        <Select.Content
                                                            position='popper'
                                                            align='end'
                                                            className='rounded-6'
                                                        >
                                                            <Select.Group>
                                                                <Select.Label>Danh mục</Select.Label>
                                                                {categories?.map((category) => (
                                                                    <Select.Item value={category.shortname}>
                                                                        {category.name}
                                                                    </Select.Item>
                                                                ))}
                                                            </Select.Group>
                                                        </Select.Content>
                                                    </Select.Root>
                                                    <Select.Root size='3' defaultValue='sold_desc'>
                                                        <Select.Trigger placeholder='Sắp xếp' />
                                                        <Select.Content position='popper' className='!rounded-8'>
                                                            <Select.Group>
                                                                <Select.Label>Thời gian</Select.Label>
                                                                <Select.Item value='createdAt_asc'>Cũ nhất</Select.Item>
                                                                <Select.Item value='createdAt_desc'>
                                                                    Mới nhất
                                                                </Select.Item>
                                                            </Select.Group>
                                                            <Select.Separator />
                                                            <Select.Group>
                                                                <Select.Label>Đã bán</Select.Label>
                                                                <Select.Item value='sold_desc'>
                                                                    Bán chạy nhất
                                                                </Select.Item>
                                                            </Select.Group>
                                                            <Select.Separator />
                                                            <Select.Group>
                                                                <Select.Label>Giá bán</Select.Label>
                                                                <Select.Item value='price_asc'>
                                                                    Giá tăng dần
                                                                </Select.Item>
                                                                <Select.Item value='price_desc'>
                                                                    Giá giảm dần
                                                                </Select.Item>
                                                            </Select.Group>
                                                        </Select.Content>
                                                    </Select.Root>
                                                    <Button size={'3'} color='red' onClick={handleClear}>
                                                        Xóa tất cả
                                                    </Button>
                                                </Flex>
                                                <Flex align={'baseline'} gapX={'3'}>
                                                    <Text size={'4'}>
                                                        {page}/{page_size}
                                                    </Text>
                                                    <Flex gapX={'1'}>
                                                        <IconButton
                                                            size={'3'}
                                                            variant='soft'
                                                            color='gray'
                                                            onClick={handlePreviousPage}
                                                        >
                                                            <ChevronLeftIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            size={'3'}
                                                            variant='soft'
                                                            color='gray'
                                                            onClick={handleNextPage}
                                                        >
                                                            <ChevronRightIcon />
                                                        </IconButton>
                                                    </Flex>
                                                </Flex>
                                            </Flex>
                                        )}
                                        <ProductInFlashSale
                                            handleFocusOut={handleFocusOut}
                                            valueRef={valueRef}
                                            products={productTab}
                                            onSelectChange={onChecked}
                                            selectedProduct={selectedProduct}
                                            tab={tab}
                                            setSelectedProduct={setSelectedProduct}
                                            joinedProduct={joinedProduct}
                                            handleCheckedAndUncheckedAll={handleCheckedAndUncheckedAll}
                                            onCheckedJoinProduct={onCheckedJoinProduct}
                                            setJoinedProduct={setJoinedProduct}
                                        />
                                    </Flex>
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                        <Flex gap='5' mt='6' justify='end'>
                            <AlertDialog.Cancel onClick={onClear}>
                                <Button variant='soft' color='red' size={'3'}>
                                    Trở về
                                </Button>
                            </AlertDialog.Cancel>
                            <Button
                                onClick={
                                    tab === 2
                                        ? handleUpdateProduct
                                        : handleJoin(storePromotionObj?.[selectedEvent?.event?.id as any]?.id)
                                }
                                variant='solid'
                                className='bg-blue text-white'
                                color='blue'
                                size={'3'}
                            >
                                {isPending && <Spinner />}
                                {tab === 2 ? 'Cập nhật' : 'Tham gia'}
                            </Button>
                        </Flex>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            </Portal>
        )
    )
}

export default SaleAlert
