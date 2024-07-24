import { useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import { VoucherApi } from 'src/apis/voucher.api'
import { AppContext } from 'src/contexts/AppContext'
import { VoucherQuery } from 'src/types/voucher.type'
import LayoutProfile from '../Profile/LayoutProfile'
import VoucherAnalytics from './VoucherAnalytics'
import VoucherFilter from './VoucherFilter'
import VoucherTable from './VoucherTable'

const Voucher = () => {
    const { who } = useContext(AppContext)
    const [query, setQuery] = useState<VoucherQuery>({ limit: import.meta.env.VITE_LIMIT })
    const [date, setDate] = useState<DateRange | undefined>(undefined)
    const [search_key, setSearch_key] = useState<string>('')
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    const { data: voucherListData, refetch: voucherRefetch } = useQuery({
        queryKey: ['VoucherList', query],
        queryFn: who === 'ADMIN' ? VoucherApi.getGlobalVoucher(query) : VoucherApi.getAllVoucher(query),
        select: (data) => data.data.result,
        placeholderData: (old) => old
    })

    const { data: voucherAnalytics, refetch: voucherAnalyticsRefetch } = useQuery({
        queryKey: ['VoucherAnalytics'],
        queryFn: VoucherApi.getAnalytics,
        staleTime: 1000 * 60 * 5,
        select: (data) => data.data.result
    })

    const refetchDataAll = async () => {
        await Promise.all([voucherRefetch(), voucherAnalyticsRefetch()])
    }

    useEffect(() => {
        if (Object.keys(query).length > 2) {
            voucherRefetch()
        }
    }, [query])

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setQuery((pre) => ({
                ...pre,
                search_key
            }))
        }, 800)
        return () => {
            window.clearTimeout(timeoutRef.current)
        }
    }, [search_key])

    return (
        <LayoutProfile
            title='Quản lý mã giảm giá'
            rightNode={
                <VoucherAnalytics
                    all={voucherAnalytics?.all ?? 0}
                    active={voucherAnalytics?.active ?? 0}
                    block={voucherAnalytics?.block ?? 0}
                    refetchDataAll={refetchDataAll}
                />
            }
        >
            <VoucherFilter
                query={query}
                setQuery={setQuery}
                page={voucherListData?.query.page ?? 0}
                page_size={voucherListData?.query.page_size ?? 0}
                date={date}
                setDate={setDate}
                search_key={search_key}
                setSearch_key={setSearch_key}
            />
            <VoucherTable data={voucherListData?.data ?? []} refetchDataAll={refetchDataAll} />
        </LayoutProfile>
    )
}

export default Voucher
