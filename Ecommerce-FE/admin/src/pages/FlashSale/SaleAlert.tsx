import { AlertDialog, Button, DataList, Flex, Portal, SegmentedControl, Spinner, Text } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { format, formatDistance, sub } from 'date-fns'
import { Dictionary } from 'lodash'
import { toast } from 'sonner'
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
    valueRef
}: SaleAlertProps) => {
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
                    <AlertDialog.Content className='rounded-8' maxWidth='1000px'>
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
