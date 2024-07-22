import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { store_api } from 'src/apis/store.api'
import { Store as StoreType } from 'src/types/auth.type'
import { StoreQuery } from 'src/types/store.type'
import LayoutProfile from '../Profile/LayoutProfile'
import Detail from './Detail'
import StoreHeader from './StoreHeader'
import StoreTable from './StoreTable'
import UpdateStatus from './UpdateStatus'

const Store = () => {
    const [query, setQuery] = useState<StoreQuery>({ page: 1, limit: 10, search_key: '' })
    const [updateStatusOpen, setUpdateStatusOpen] = useState<boolean>(false)
    const [detailOpen, setDetailOpen] = useState<boolean>(false)
    const [date, setDate] = useState<DateRange | undefined>({ from: query?.start_date, to: query?.end_date })

    const [selectedStore, setSelectedStore] = useState<StoreType | undefined>(undefined)

    const { data: stores, refetch: refetchStores } = useQuery({
        queryKey: ['stores', query],
        queryFn: store_api.getStores(query),
        select: (data) => data.data.result,
        enabled: false,
        placeholderData: (old) => old
    })

    const { mutate: updateStatus, isPending: isUpdating } = useMutation({
        mutationFn: store_api.updateStatusOfStore(selectedStore?.id || ''),
        onSuccess: () => {
            setUpdateStatusOpen(false)
            toast.success('Cập nhật trạng thái thành công')
            refetchStores()
        },
        onError: (err) => {
            if (isAxiosError(err)) {
                toast.error(err.response?.data?.msg || 'Cập nhật trạng thái thất bại')
            }
        }
    })

    useEffect(() => {
        refetchStores()
    }, [query])

    return (
        <LayoutProfile title='Quản lý cửa hàng' isFullHeight>
            <StoreHeader
                query={query}
                pagination={{ page: 1, page_size: 10 }}
                date={date}
                setDate={setDate}
                setQuery={setQuery}
            />
            <StoreTable
                stores={stores?.data || []}
                query={query}
                setDetailOpen={setDetailOpen}
                setSelectedStore={setSelectedStore}
                setStatusUpdateOpen={setUpdateStatusOpen}
            />
            <UpdateStatus
                open={updateStatusOpen}
                setOpen={setUpdateStatusOpen}
                selectedStore={selectedStore}
                updateStatus={updateStatus}
                isUpdating={isUpdating}
            />
            <Detail open={detailOpen} setOpen={setDetailOpen} selectedStore={selectedStore} />
        </LayoutProfile>
    )
}

export default Store
