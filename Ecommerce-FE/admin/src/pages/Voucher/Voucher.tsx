import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { VoucherApi } from 'src/apis/voucher.api'
import { VoucherQuery } from 'src/types/voucher.type'
import LayoutProfile from '../Profile/LayoutProfile'
import VoucherAnalytics from './VoucherAnalytics'
import VoucherFilter from './VoucherFilter'
import VoucherTable from './VoucherTable'

const Voucher = () => {
    const [query, setQuery] = useState<VoucherQuery>({ limit: import.meta.env.VITE_LIMIT, createdAt: 'desc' })

    const { data: voucherListData, refetch: voucherRefetch } = useQuery({
        queryKey: ['VoucherList', JSON.stringify(query)],
        queryFn: () => VoucherApi.getAllVoucher(query),
        staleTime: Infinity,
        select: (data) => data.data.result
    })

    const { data: voucherAnalytics, refetch: voucherAnalyticsRefetch } = useQuery({
        queryKey: ['VoucherAnalytics'],
        queryFn: VoucherApi.getAnalytics,
        staleTime: Infinity,
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
            />
            <VoucherTable data={voucherListData?.data ?? []} refetchDataAll={refetchDataAll} />
        </LayoutProfile>
    )
}

export default Voucher
