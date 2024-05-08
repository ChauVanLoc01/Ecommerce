import { Text } from '@radix-ui/themes'
import LayoutProfile from '../Profile/LayoutProfile'
import OrderFilter from './OrderFilter'
import OrderTable from './OrderTable'

const Order = () => {
    return (
        <LayoutProfile
            title='Quản lý đơn hàng'
            rightNode={
                <>
                    <Text weight='medium' size={'4'}>
                        Tổng 1000 đơn hàng
                    </Text>
                </>
            }
        >
            <div className='space-y-5'>
                <div className='bg-white rounded-8 border-border/30 space-y-4'>
                    <OrderFilter />
                </div>
                <OrderTable />
            </div>
        </LayoutProfile>
    )
}

export default Order
