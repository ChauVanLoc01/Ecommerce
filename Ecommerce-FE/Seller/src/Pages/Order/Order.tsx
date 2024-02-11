import { useState } from 'react'

import { DatePicker, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { motion } from 'framer-motion'
import { AiOutlineLine } from 'react-icons/ai'
import { BsStackOverflow } from 'react-icons/bs'
import { GoSearch } from 'react-icons/go'
import { Link, useOutletContext } from 'react-router-dom'

import Icon from 'src/Components/Icon'
import Select from 'src/Components/Select'
import Underline from 'src/Components/Underline'
import { delivery } from 'src/constants/delivery.constants'
import { orderColor, orderStatus } from 'src/constants/orderStatus.enum'
const { RangePicker } = DatePicker

type TableHeaderData = {
    id: string
    user_name: string
    address: string
    time_start: string
    time_end: string
    status: orderStatus
    total: number
    delivery: 'Tiết Kiệm' | 'Hỏa Tốc' | 'Nhanh' | 'Viettel Post'
}

function Order() {
    const [choosed, setChoosed] = useState<string | undefined>(undefined)
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const maxHeight = useOutletContext()

    const columns: ColumnsType<TableHeaderData> = [
        {
            title: 'Khách hàng',
            dataIndex: 'user_name',
            key: 'user_name'
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: 'Đặt hàng',
            dataIndex: 'time_start',
            key: 'time_start'
        },
        {
            title: 'Nhận hàng',
            dataIndex: 'time_end',
            key: 'time_end'
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (_, { status }) => (
                <Tag color={orderColor[status]}>{status}</Tag>
            )
        },
        {
            title: 'Vận chuyển',
            dataIndex: 'delivery',
            key: 'delivery',
            render: (_, { delivery: vc }) => (
                <Tag color={delivery[vc]}>{vc}</Tag>
            )
        },
        {
            dataIndex: 'id',
            key: 'id',
            render: (_, { id }) => (
                <section className='flex items-center'>
                    <Link to={id} onClick={() => setIsOpenModal(true)}>
                        <Tag color='#096dd9'>Edit</Tag>
                    </Link>
                    <button onClick={() => setIsOpenModal(false)}>
                        <Tag color='#f5222d'>Delete</Tag>
                    </button>
                </section>
            )
        }
    ]

    const data: TableHeaderData[] = [
        {
            id: '1',
            user_name: 'Chau Van Loc',
            address: 'Tien Giang',
            time_start: '16h 22-12-2024',
            time_end: '16h 22-12-2024',
            total: 100,
            status: orderStatus.cancel,
            delivery: 'Nhanh'
        },
        {
            id: '2',
            user_name: 'Chau Van Loc',
            address: 'Tien Giang',
            time_start: '16h 22-12-2024',
            time_end: '16h 22-12-2024',
            total: 100,
            status: orderStatus.shipperIsShipping,
            delivery: 'Hỏa Tốc'
        },
        {
            id: '3',
            user_name: 'Chau Van Loc',
            address: 'Tien Giang',
            time_start: '16h 22-12-2024',
            time_end: '16h 22-12-2024',
            total: 100,
            status: orderStatus.confirm,
            delivery: 'Viettel Post'
        },
        {
            id: '4',
            user_name: 'Chau Van Loc',
            address: 'Tien Giang',
            time_start: '16h 22-12-2024',
            time_end: '16h 22-12-2024',
            total: 100,
            status: orderStatus.success,
            delivery: 'Tiết Kiệm'
        },
        {
            id: '5',
            user_name: 'Chau Van Loc',
            address: 'Tien Giang',
            time_start: '16h 22-12-2024',
            time_end: '16h 22-12-2024',
            total: 100,
            status: orderStatus.waitingShiper,
            delivery: 'Hỏa Tốc'
        }
    ]

    return (
        <motion.section
            className={`bg-white border border-gray-200 rounded-primary overflow-hidden  space-y-4 text-[15px] shadow-md pb-3 h-[${maxHeight}px]`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0.9 }}
            transition={{ duration: 0.75 }}
        >
            <div className='flex border-b border-gray-200 sticky top-0 bg-white z-50'>
                <Underline
                    contents={[
                        {
                            title: 'Tất cả',
                            to: ''
                        },
                        {
                            title: 'Chờ xác nhận',
                            to: {
                                search: `status=${orderStatus.confirm}`
                            }
                        },
                        {
                            title: 'Chờ lấy hàng',
                            to: {
                                search: `status=${orderStatus.waitingShiper}`
                            }
                        },
                        {
                            title: 'Đang giao',
                            to: {
                                search: `status=${orderStatus.shipperIsShipping}`
                            }
                        },
                        {
                            title: 'Đã giao',
                            to: {
                                search: `status=${orderStatus.shippingSuccess}`
                            }
                        },
                        {
                            title: 'Đơn hủy',
                            to: {
                                search: `status=${orderStatus.cancel}`
                            }
                        },
                        {
                            title: 'Trả hàng / Hoàn tiền',
                            to: {
                                search: `status=${orderStatus.refund}`
                            }
                        }
                    ]}
                    rootClassName='px-5'
                    itemClassName='px-4 py-3'
                />
            </div>
            <div className='px-5 flex items-center space-x-4'>
                <div className='flex basis-8/12'>
                    <Select
                        title='Mã đơn hàng'
                        data={[
                            'Mã đơn hàng',
                            'Tên người mua',
                            'Sản phẩm',
                            'Mã vận đơn',
                            'Mã yêu cầu trả hàng'
                        ]}
                        setChoosed={setChoosed}
                        defaultValue={1}
                    />
                    <div className='border rounded-r-xs border-gray-200 basis-8/12 flex items-center relative hover:border-gray-400 flex-grow'>
                        <input
                            className='outline-none w-full px-3 pr-8'
                            type='text'
                            name='search'
                            id='search'
                            placeholder={`Nhập ${
                                choosed ? choosed.toLowerCase() : '...'
                            }`}
                        />
                        <Icon
                            icon={<GoSearch />}
                            className='absolute right-2 top-1/2 -translate-y-1/2'
                            size='16px'
                        />
                    </div>
                </div>
                <div>
                    <button className='px-3 py-1 bg-primary text-white hover:bg-primary/90 rounded-xs'>
                        Tìm kiếm
                    </button>
                </div>
                <div>
                    <button className='px-3 py-1 hover:bg-gray-100 rounded-xs border border-gray-200'>
                        Đặt lại
                    </button>
                </div>
            </div>
            <div className='flex space-x-5 items-center px-5'>
                <div className='flex items-center space-x-3'>
                    <span>Đơn vị vận chuyển:</span>
                    <Select
                        data={[
                            'Hỏa tốc',
                            'Shop express',
                            'Giao hàng tiết kiệm',
                            'Viettel Post'
                        ]}
                        title='Lựa chọn ...'
                    />
                </div>
                <div className='flex space-x-3'>
                    <span>Ngày đặt hàng:</span>
                    <RangePicker
                        format={'DD-MM-YYYY'}
                        placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                        separator={
                            <Icon
                                icon={<AiOutlineLine />}
                                size='10px'
                                color='#bfbfbf'
                            />
                        }
                        className='rounded-xs border-gray-200 hover:border-gray-400'
                    />
                </div>
                <div className='flex items-center space-x-3'>
                    <span>Sắp xếp theo:</span>
                    <Select
                        data={[
                            'Mới nhất',
                            'Cũ nhất',
                            'Đơn hàng giá trị cao',
                            'Đơn hàng giá trị thấp'
                        ]}
                        title='Lựa chọn ...'
                    />
                </div>
            </div>
            <div className='flex justify-between px-5'>
                <span className='text-sm font-semibold'>0 Đơn hàng</span>
                <div>
                    <button className='flex items-center space-x-2 px-2 py-1 rounded-xs border border-gray-200 hover:bg-primary/90 text-white bg-primary'>
                        <Icon icon={<BsStackOverflow />} size='18px' />
                        <span>Giao Hàng Loạt</span>
                    </button>
                </div>
            </div>
            <div className='px-5'>
                <Table className='mb-2' columns={columns} dataSource={data} />
            </div>
        </motion.section>
    )
}

export default Order
