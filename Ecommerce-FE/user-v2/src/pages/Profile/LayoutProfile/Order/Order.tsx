import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from 'src/components/Shadcn/tabs'

import { OrderTable } from './OrderTable/Table'
import LayoutProfile from '../LayoutProfile'

const Order = () => {
    return (
        <LayoutProfile title='Đơn hàng của bạn'>
            <Tabs defaultValue='account' className='rounded-8'>
                <TabsList className='bg-[#F8F9FA]'>
                    <TabsTrigger
                        className='!rounded-8 px-4 py-1.5 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600'
                        value='account'
                    >
                        Tất cả
                    </TabsTrigger>
                    <TabsTrigger
                        className='!rounded-8 px-4 py-1.5 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600'
                        value='password'
                    >
                        Thành công
                    </TabsTrigger>
                    <TabsTrigger
                        className='!rounded-8 px-4 py-1.5 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600'
                        value='password1'
                    >
                        Chờ xác nhận
                    </TabsTrigger>
                </TabsList>
                <TabsContent className='w-full' value='account'>
                    <OrderTable />
                </TabsContent>
                <TabsContent value='password'>
                    Change your password here.
                </TabsContent>
                <TabsContent value='password1'>
                    Change your password here.
                </TabsContent>
            </Tabs>
        </LayoutProfile>
    )
}

export default Order
