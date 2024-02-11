import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { motion } from 'framer-motion'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { Link } from 'react-router-dom'

import Icon from 'src/Components/Icon'
import { Path } from 'src/constants/path.enum'

import CustomerInformation from './CustomerInformation'
import PaidByCustomer from './PaidByCustomer'
import Timeline from './Timeline'
import './OrderDetail.css'

type TableHeaderData = {
    id: string
    product_name: string
    quantity: number
    price: number
    total: number
}

const OrderDetail = () => {
    const columns: ColumnsType<TableHeaderData> = [
        {
            title: 'Mã',
            dataIndex: 'id',
            key: 'id'
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product_name',
            key: 'product_name'
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity'
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total'
        }
    ]

    const data: TableHeaderData[] = [
        {
            id: '1',
            product_name: 'Áo thun name',
            price: 200000,
            quantity: 1,
            total: 200000
        },
        {
            id: '2',
            product_name: 'Áo thun name',
            price: 200000,
            quantity: 1,
            total: 200000
        },
        {
            id: '3',
            product_name: 'Áo thun name',
            price: 200000,
            quantity: 1,
            total: 200000
        }
    ]

    return (
        <motion.div
            initial={{
                x: -20,
                opacity: 0
            }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='p-5 bg-white space-y-5'
        >
            <section className='flex justify-between'>
                <div className='flex space-x-3'>
                    <Link
                        to={`/${Path.order}`}
                        className='px-2 border border-gray-200 flex items-center justify-center rounded-[3.5px]'
                    >
                        <Icon icon={<IoIosArrowRoundBack />} size='22px' />
                    </Link>
                    <span className='text-[12px] font-semibold flex items-center justify-center'>
                        SPRITE-100063
                    </span>
                </div>
                <div className='flex space-x-3 text-[12px]'>
                    <div className='flex items-center space-x-1 rounded-[3.5px] border border-gray-200 px-2 py-[2px]'>
                        <span className=''>Status:</span>
                        <span className='text-green-600'>Completed</span>
                    </div>
                    <button className='px-3 bg-blue-500 text-white rounded-[3.5px]'>
                        Tải xuống
                    </button>
                    <button className='px-2 py-1 rounded-[3.5px] border border-gray-200'>
                        <Icon icon={<HiOutlineDotsVertical />} size='18px' />
                    </button>
                    <div>
                        <button></button>
                    </div>
                </div>
            </section>
            <section className='flex space-x-5'>
                <div className='basis-3/5 space-y-4'>
                    <div className='space-y-2'>
                        <h2 className='font-semibold'>Order Details</h2>
                        <Table
                            className='mb-2'
                            id='order-detail'
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                        />
                    </div>
                    <PaidByCustomer />
                </div>
                <div className=''>
                    <CustomerInformation />
                </div>
            </section>
            <Timeline />
        </motion.div>
    )
}

export default OrderDetail
