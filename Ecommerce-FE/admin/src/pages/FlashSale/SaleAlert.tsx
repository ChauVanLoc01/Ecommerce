import { AlertDialog, Button, DataList, Flex, Portal, SegmentedControl, Spinner, Text } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { format, formatDistance, getHours } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Dictionary } from 'lodash'
import { useState } from 'react'
import { Event } from 'react-big-calendar'
import { toast } from 'sonner'
import { sale_api } from 'src/apis/sale.api'
import { formatDateDefault, formatDefault, formatHourDefault } from 'src/constants/date.constants'
import { Product } from 'src/types/product.type'
import { SalePromotion, StoreWithProductSalePromotion } from 'src/types/sale.type'
import ProductInFlashSale from './ProductInFlashSale'

type SaleAlertProps = {
    selectedEvent: {
        open: boolean
        event?: Event
    }
    setSelectedEvent: React.Dispatch<
        React.SetStateAction<{
            open: boolean
            event?: SalePromotion
        }>
    >
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
    productTab: Product[][]
    refetchSalePromotion: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                promotionObjs: Dictionary<SalePromotion>
                storePromotionObj: Dictionary<StoreWithProductSalePromotion>
            },
            Error
        >
    >
}

const SaleAlert = ({
    selectedEvent,
    setSelectedEvent,
    selectedProduct,
    setSelectedProduct,
    productTab,
    refetchSalePromotion
}: SaleAlertProps) => {
    const [tab, setTab] = useState<number>(0)

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
            setSelectedProduct((pre) => ({
                products: {
                    ...pre.products,
                    [product.id]: {
                        ...product,
                        priceAfterInSale: 0,
                        priceBeforeInSale: 0,
                        quantityInSale: 0,
                        isExist: false
                    }
                },
                size: pre.size + 1
            }))
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

    const handleJoin = () => {
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
            products: Object.keys(selectedProduct.products).map((e) => ({
                productId: e,
                priceAfter: selectedProduct.products[e].priceAfterInSale,
                quantity: selectedProduct.products[e].quantityInSale
            }))
        })
    }

    const onClear = () => setSelectedProduct({ products: {}, size: 0 })

    const formatDate = (date: string) => `${format(date, formatDefault)}`

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
                                        <Text className='italic' color='gray'>
                                            (Đã tham gia:{' '}
                                            {formatDistance(
                                                new Date(),
                                                (selectedEvent.event as SalePromotion).createdAt
                                            )}
                                            )
                                        </Text>
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
                                        {format((selectedEvent.event as SalePromotion).startDate, formatDefault)}(
                                        {formatDistance(new Date(), (selectedEvent.event as SalePromotion).endDate)})
                                    </Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Kết thúc</DataList.Label>
                                <DataList.Value className='items-center'>
                                    <Text>{format((selectedEvent.event as SalePromotion).endDate, formatDefault)}</Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item className='!flex !flex-col'>
                                <DataList.Label>
                                    <SegmentedControl.Root defaultValue='0' size={'2'} onValueChange={handleChangeTab}>
                                        <SegmentedControl.Item value='0'>Tổng</SegmentedControl.Item>
                                        <SegmentedControl.Item value='1'>
                                            Đã chọn ({selectedProduct.size})
                                        </SegmentedControl.Item>
                                    </SegmentedControl.Root>
                                </DataList.Label>
                                <DataList.Value className='items-center w-full'>
                                    <ProductInFlashSale
                                        products={productTab[tab]}
                                        onSelectChange={onChecked}
                                        selectedProduct={selectedProduct}
                                        isSelectedMode={!!+tab}
                                        setSelectedProduct={setSelectedProduct}
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
                                onClick={handleJoin}
                                variant='solid'
                                className='bg-blue text-white'
                                color='blue'
                                size={'3'}
                            >
                                {isPending && <Spinner />}
                                Tham gia
                            </Button>
                        </Flex>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            </Portal>
        )
    )
}

export default SaleAlert
