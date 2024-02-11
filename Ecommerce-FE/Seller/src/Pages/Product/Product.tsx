import { useState } from 'react'

import { DatePicker, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { motion } from 'framer-motion'
import { AiOutlineLine } from 'react-icons/ai'
import { BsStackOverflow } from 'react-icons/bs'
import { GoSearch } from 'react-icons/go'
import { IoAddOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'

import Icon from 'src/Components/Icon'
import Select from 'src/Components/Select'
import Underline from 'src/Components/Underline'
import { productStatus } from 'src/constants/productStatus.enum'
const { RangePicker } = DatePicker

type Delivery = ('TK' | 'HT' | 'NH' | 'KH')[]

type TableHeaderData = {
    key: string
    name: string
    total: number
    pay: number
    code: number
    delivery: Delivery
}

const columns: ColumnsType<TableHeaderData> = [
    Table.EXPAND_COLUMN,
    {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <Link to={'/'}>{text}</Link>
    },
    {
        title: 'Tổng đơn hàng',
        dataIndex: 'total',
        key: 'total'
    },
    {
        title: 'Đã thanh toán',
        dataIndex: 'pay',
        key: 'pay'
    },
    {
        title: 'Ship code',
        dataIndex: 'code',
        key: 'code'
    },
    {
        title: 'DVVC',
        dataIndex: 'delivery',
        key: 'delivery',
        render: (_, { delivery }) => (
            <div className='grid grid-cols-2 gap-1'>
                {delivery.map((d) => {
                    switch (d) {
                        case 'HT':
                            return (
                                <span className='p-0.5 text-center rounded-xs border border-blue-500 text-blue-500 bg-blue-50'>
                                    Hỏa tốc
                                </span>
                            )
                        case 'TK':
                            return (
                                <span className='p-0.5 text-center rounded-xs border border-green-500 text-green-500'>
                                    Tiết kiệm
                                </span>
                            )
                        case 'NH':
                            return (
                                <span className='p-0.5 text-center rounded-xs border border-orange-500 text-orange-500'>
                                    Nhanh
                                </span>
                            )
                        case 'KH':
                            return (
                                <span className='p-0.5 text-center rounded-xs border border-blue-500 text-blue-500'>
                                    Khác
                                </span>
                            )
                        default:
                            break
                    }
                })}
            </div>
        )
    }
]

const data: TableHeaderData[] = [
    {
        key: '1',
        name: 'Quần áo trẻ em',
        total: 10,
        pay: 3,
        code: 7,
        delivery: ['HT', 'NH']
    },
    {
        key: '2',
        name: 'Quần áo trẻ em',
        total: 10,
        pay: 3,
        code: 7,
        delivery: ['HT', 'NH']
    },
    {
        key: '3',
        name: 'Quần áo trẻ em',
        total: 10,
        pay: 3,
        code: 7,
        delivery: ['HT', 'NH']
    },
    {
        key: '4',
        name: 'Quần áo trẻ em',
        total: 10,
        pay: 3,
        code: 7,
        delivery: ['HT', 'NH']
    },
    {
        key: '5',
        name: 'Quần áo trẻ em',
        total: 10,
        pay: 3,
        code: 7,
        delivery: ['HT', 'NH']
    },
    {
        key: '6',
        name: 'Quần áo trẻ em',
        total: 10,
        pay: 3,
        code: 7,
        delivery: ['HT', 'NH']
    }
]

function Product() {
    const [choosed, setChoosed] = useState<string | undefined>(undefined)
    return (
        <motion.section
            className='bg-white rounded-xs space-y-4 text-xs shadow-sm hover:shadow-md'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
        >
            <div className='flex border-b border-gray-200'>
                <Underline
                    contents={[
                        {
                            title: 'Tất cả',
                            to: ''
                        },
                        {
                            title: 'Sản phẩm mới',
                            to: {
                                search: `status=${productStatus.new}`
                            }
                        },
                        {
                            title: 'Bán chạy nhất',
                            to: {
                                search: `status=${productStatus.best_seller}`
                            }
                        },
                        {
                            title: 'Hết hàng',
                            to: {
                                search: `status=${productStatus.sold_out}`
                            }
                        }
                    ]}
                    rootClassName='px-5'
                    itemClassName='px-4 py-3'
                />
            </div>
            <div className='flex justify-end space-x-5 items-center px-5'>
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
                <div>
                    <button className='px-3 py-1 border border-gray-400 rounded-xs'>
                        Xuất
                    </button>
                </div>
            </div>
            <div className='px-5 flex items-center justify-between'>
                <div className='flex xl:basis-10/12 md:basis-3/4'>
                    <div className='basis-4/12'>
                        <Select
                            title='Mã đơn hàng'
                            data={[
                                'Mã đơn hàng',
                                'Tên người mua',
                                'Sản phẩm',
                                'Mã vận đơn',
                                'Mã yêu cầu trả hàng'
                            ]}
                            refClassName='py-[6px] px-2 rounded-none rounded-l-xs border-gray-200'
                            itemInFloatingClassname='px-2 py-1'
                            floatingClassNames='rounded-xs'
                            setChoosed={setChoosed}
                            defaultValue={1}
                        />
                    </div>
                    <div className='border rounded-r-xs border-gray-200 basis-8/12 flex items-center relative hover:border-gray-400'>
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
            <div className='flex justify-between px-5'>
                <span className='text-sm font-semibold'>0 Đơn hàng</span>
                <div>
                    <button className='flex items-center space-x-2 px-2 py-1 rounded-xs border border-gray-200 hover:bg-primary/90 text-white bg-primary'>
                        <Icon icon={<IoAddOutline />} size='18px' />
                        <span>Thêm sản phẩm mới</span>
                    </button>
                </div>
            </div>
            <div className='px-5'>
                <Table
                    columns={columns}
                    dataSource={data}
                    expandable={{
                        expandedRowRender: (record) => (
                            <div>
                                <div className='font-semibold'>
                                    Chi tiết đơn hàng
                                </div>
                                <div>{record.name}</div>
                            </div>
                        )
                    }}
                />
            </div>
        </motion.section>
    )
}

export default Product
