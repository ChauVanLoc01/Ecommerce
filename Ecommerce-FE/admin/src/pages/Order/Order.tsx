import { Flex, Kbd, Text } from '@radix-ui/themes'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { OrderApi } from 'src/apis/order.api'
import { OrderQuery } from 'src/types/order.type'
import LayoutProfile from '../Profile/LayoutProfile'
import OrderFilter from './OrderFilter'
import OrderTable from './OrderTable'

const Order = () => {
    const [query, setQuery] = useState<OrderQuery>({ limit: import.meta.env.VITE_LIMIT, createdAt: 'desc' })

    const { data, refetch: orderListRefetch } = useQuery({
        queryKey: ['orderList', JSON.stringify(query)],
        queryFn: () => OrderApi.getAllOrder(query),
        staleTime: 1000 * 60 * 1,
        enabled: false,
        placeholderData: (oldData) => oldData,
        select: (data) => data.data.result
    })

    const { data: analyticOrderStore, refetch: analyticOrderStoreRefetching } = useQuery({
        queryKey: ['analyticOrderStore'],
        queryFn: OrderApi.analyticOrderStore,
        staleTime: 1000 * 60 * 1,
        refetchInterval: 1000 * 60 * 1,
        enabled: false,
        placeholderData: (oldData) => oldData,
        select: (data) => data.data.result
    })

    useEffect(() => {
        if (Object.keys(query).length > 2) {
            orderListRefetch()
        }
    }, [query])

    return (
        <LayoutProfile
            title='Quản lý đơn hàng'
            rightNode={
                <Flex gapX={'5'}>
                    <Text weight='medium' size={'4'}>
                        Tổng: <Kbd>{analyticOrderStore?.all}</Kbd>
                    </Text>
                    <Text weight='medium' size={'4'}>
                        Thành công: <Kbd>{analyticOrderStore?.success}</Kbd>
                    </Text>
                    <Text weight='medium' size={'4'}>
                        Chờ xác nhận: <Kbd>{analyticOrderStore?.waiting_confirm}</Kbd>
                    </Text>
                    <Text weight='medium' size={'4'}>
                        Đang giao hàng: <Kbd>{analyticOrderStore?.shipping}</Kbd>
                    </Text>
                    <Text weight='medium' size={'4'}>
                        Đã hủy: <Kbd>{analyticOrderStore?.cancel}</Kbd>
                    </Text>
                </Flex>
            }
        >
            <div className='space-y-5'>
                <div className='bg-white rounded-8 border-border/30 space-y-4'>
                    <OrderFilter
                        pagination={{ page: data?.query.page ?? 0, page_size: data?.query.page_size ?? 0 }}
                        setQuery={setQuery}
                    />
                </div>
                <OrderTable
                    data={data?.data ?? []}
                    orderListRefetch={orderListRefetch}
                    analyticOrderStoreRefetching={analyticOrderStoreRefetching}
                />
            </div>
        </LayoutProfile>
    )
}

export default Order
