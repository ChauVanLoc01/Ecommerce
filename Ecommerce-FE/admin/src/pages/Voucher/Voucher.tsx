import LayoutProfile from '../Profile/LayoutProfile'
import VoucherAnalytics from './VoucherAnalytics'
import VoucherFilter from './VoucherFilter'
import VoucherTable from './VoucherTable'

const Voucher = () => {
    return (
        <LayoutProfile title='Quản lý mã giảm giá' rightNode={<VoucherAnalytics />}>
            <VoucherFilter />
            <VoucherTable />
        </LayoutProfile>
    )
}

export default Voucher
