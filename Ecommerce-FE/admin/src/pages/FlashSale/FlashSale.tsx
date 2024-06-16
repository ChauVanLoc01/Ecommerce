import { AlertDialog, DataList, Flex, Portal, SegmentedControl, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { differenceInHours, format, getDay, getMinutes, parse, startOfWeek } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useContext, useState } from 'react'
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ProductApi } from 'src/apis/product.api'
import { AppContext } from 'src/contexts/AppContext'
import { Store } from 'src/types/auth.type'
import { Product } from 'src/types/product.type'
import ProductInFlashSale from './ProductInFlashSale'

const locales = {
    vi: vi
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

const FlashSale = () => {
    const { store } = useContext(AppContext)
    const [open, setOpen] = useState<boolean>(false)
    const [selectedProduct, setSelectedProduct] = useState<{ products: Record<string, Product>; size: number }>({
        products: {},
        size: 0
    })

    const { refetch: productListRefetch, data: productList } = useQuery({
        queryKey: ['productList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT })],
        queryFn: () =>
            ProductApi.getAllProduct({ query: { limit: import.meta.env.VITE_LIMIT }, storeId: (store as Store).id }),
        placeholderData: (previousData) => previousData,
        select: (data) => data.data.result
    })

    const onSelectEvent = (e: SlotInfo) => {
        setOpen(true)
    }

    const onSelecting = (range: { start: Date; end: Date }) => {
        if (
            getMinutes(new Date(range.start)) > 0 ||
            differenceInHours(range.end, range.start, { roundingMethod: 'round' }) > 1
        ) {
            return false
        } else {
            return true
        }
    }

    const onSelectChange = (product: Product) => (checked: boolean) => {
        if (checked) {
            setSelectedProduct((pre) => ({ products: { ...pre.products, [product.id]: product }, size: pre.size + 1 }))
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

    const onSelectAll = () => {}

    return (
        <>
            <Calendar
                localizer={localizer}
                culture='vi'
                startAccessor='start'
                endAccessor='end'
                style={{ height: 650 }}
                messages={{
                    today: 'Hôm nay',
                    week: 'Tuần',
                    day: 'Ngày',
                    month: 'Tháng',
                    yesterday: 'Ngày hôm qua',
                    allDay: 'Tất cả các ngày',
                    next: 'Kế tiếp',
                    event: 'Sự kiện',
                    noEventsInRange: 'Không có sự kiện',
                    previous: 'Quay lại',
                    showMore: (count) => (!count ? 'Hết' : 'Xem thêm'),
                    tomorrow: 'Ngày mai',
                    time: 'Thời gian',
                    work_week: 'Tuần làm việc',
                    agenda: 'Sự kiện'
                }}
                selectable
                step={60}
                timeslots={1}
                views={{ month: true, week: true, agenda: true }}
                onSelectSlot={onSelectEvent}
                onSelecting={onSelecting}
            />
            <Portal>
                <AlertDialog.Root open={open} onOpenChange={setOpen}>
                    <AlertDialog.Content className='rounded-8' maxWidth='1000px'>
                        <AlertDialog.Title>Tham gia sự kiện</AlertDialog.Title>
                        <DataList.Root>
                            <DataList.Item>
                                <DataList.Label>Tên sự kiện</DataList.Label>
                                <DataList.Value className='items-center'>
                                    <Text>Chương trình giảm giá hằng ngày</Text>
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
                                    <Text>Chương trình giảm giá hằng ngày</Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item>
                                <DataList.Label>Kết thúc</DataList.Label>
                                <DataList.Value className='items-center'>
                                    <Text>Chương trình giảm giá hằng ngày</Text>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item className='!flex !flex-col'>
                                <DataList.Label>
                                    <SegmentedControl.Root defaultValue='inbox' size={'3'}>
                                        <SegmentedControl.Item value='inbox'>Hiện có (2)</SegmentedControl.Item>
                                        <SegmentedControl.Item value='drafts'>Đã chọn (1)</SegmentedControl.Item>
                                    </SegmentedControl.Root>
                                </DataList.Label>
                                <DataList.Value className='items-center w-full'>
                                    <ProductInFlashSale
                                        products={productList?.data || []}
                                        onSelectChange={onSelectChange}
                                        selectedProduct={selectedProduct}
                                    />
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </AlertDialog.Content>
                </AlertDialog.Root>
            </Portal>
        </>
    )
}

export default FlashSale
