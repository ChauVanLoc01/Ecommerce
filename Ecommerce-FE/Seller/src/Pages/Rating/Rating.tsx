import { DatePicker, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { AiOutlineLine } from 'react-icons/ai'

import Icon from 'src/Components/Icon'
import Underline from 'src/Components/Underline'
const { RangePicker } = DatePicker

type TableHeaderData = {
    key: string
    name: string
    rating: number
    answer: number
}

const columns: ColumnsType<TableHeaderData> = [
    Table.EXPAND_COLUMN,
    {
        title: 'Thông tin Sản phẩm',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Đánh giá của người mua',
        dataIndex: 'rating',
        key: 'rating'
    },
    {
        title: 'Trả lời đánh giá của bạn',
        dataIndex: 'answer',
        key: 'answer'
    }
]

const data: TableHeaderData[] = []
function Rating() {
    return (
        <div className='bg-white space-y-3 rounded-xs'>
            <div className='flex items-end justify-between w-full border-b border-gray-200 py-2 px-3'>
                <div>
                    <div className='font-medium text-base'>Đánh giá shop</div>
                    <span>Xem đánh giá Shop của bạn</span>
                </div>
                <div className='space-x-1 pr-3'>
                    <span className='text-red-500 font-medium text-xl'>
                        0.0
                    </span>
                    <span>/</span>
                    <span>5</span>
                </div>
            </div>
            <div className='flex lg:flex-wrap gap-y-3 lg:pr-16 xl:pr-10'>
                <div className='flex space-x-2 items-center xl:basis-1/3 lg:basis-1/2 justify-end'>
                    <label htmlFor=''>Tên sản phẩm</label>
                    <div className='px-2 py-1.5 rounded-xs border border-gray-200'>
                        <input
                            className='outline-none w-full'
                            placeholder='Nhập tên sản phẩm'
                            type='text'
                            name=''
                            id=''
                        />
                    </div>
                </div>
                <div className='flex space-x-2 items-center xl:basis-1/3 lg:basis-1/2 justify-end'>
                    <label htmlFor=''>Phân loại hàng</label>
                    <div className='px-2 py-1.5 rounded-xs border border-gray-200'>
                        <input
                            className='outline-none w-full'
                            placeholder='Nhập loại hàng'
                            type='text'
                            name=''
                            id=''
                        />
                    </div>
                </div>
                <div className='flex space-x-2 items-center xl:basis-1/3 lg:basis-1/2 justify-end'>
                    <label htmlFor=''>Người mua</label>
                    <div className='px-2 py-1.5 rounded-xs border border-gray-200'>
                        <input
                            className='outline-none w-full'
                            placeholder='Nhập tên người mua'
                            type='text'
                            name=''
                            id=''
                        />
                    </div>
                </div>
                <div className='flex space-x-2 items-center xl:basis-1/3 lg:basis-1/2 justify-end'>
                    <label htmlFor=''>Thời gian đánh giá</label>
                    <RangePicker
                        format={'DD-MM-YYYY'}
                        placeholder={['Bắt đầu', 'Kết thúc']}
                        separator={
                            <Icon
                                icon={<AiOutlineLine />}
                                size='10px'
                                color='#bfbfbf'
                            />
                        }
                        className='rounded-xs border-gray-200 hover:border-gray-400 w-[195px] py-1'
                    />
                </div>
                <div className='lg:w-full xl:basis-1/3 xl:text-center lg:text-right space-x-5'>
                    <button className='px-4 py-1 border text-white bg-primary hover:bg-primary/90 rounded-xs'>
                        Tìm
                    </button>
                    <button className='px-4 py-1 border border-gray-200 rounded-xs'>
                        Nhập lại
                    </button>
                </div>
            </div>
            <div className='px-3'>
                <Underline
                    rootClassName='border-b border-gray-200'
                    itemClassName='px-2 py-2 rounded-xs'
                    contents={[
                        'Tất cả',
                        'Chờ xác nhận',
                        'Chờ lấy hàng',
                        'Đang giao',
                        'Đã giao',
                        'Đơn hủy',
                        'Trả hàng/Hoàn tiền'
                    ]}
                />
            </div>
            <div className='p-3 overflow-hidden space-y-2'>
                <div className='divide-x rounded-xs border border-gray-200 w-fit h-fit overflow-hidden'>
                    <button className='px-3 py-1'>Tất cả</button>
                    <button className='px-3 py-1'>5 sao</button>
                    <button className='px-3 py-1'>4 sao</button>
                    <button className='px-3 py-1'>3 sao</button>
                    <button className='px-3 py-1'>2 sao</button>
                    <button className='px-3 py-1'>1 sao</button>
                </div>
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
        </div>
    )
}

export default Rating
