import { DatePicker, Rate, Tag } from 'antd'
import { motion } from 'framer-motion'
import { AiOutlineLine } from 'react-icons/ai'

import Icon from 'src/Components/Icon'
import Select from 'src/Components/Select'

import CommentCard from './CommentCard'
import RatingPercent from './RatingPercent'

const { RangePicker } = DatePicker

const Views = () => {
    return (
        <motion.section
            className='bg-white p-5 rounded-sm hover:shadow-md shadow-sm space-y-3'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            <section className='flex items-center justify-between'>
                <h2 className='font-semibold text-xl drop-shadow-md'>
                    Reviews
                </h2>
                <div className='space-x-5 flex items-center'>
                    <section className='flex items-center text-xs space-x-3'>
                        <span className='font-medium'>Sắp xếp theo:</span>
                        <Select
                            title='Chọn lựa...'
                            data={['Mới nhất', 'Cũ nhất']}
                        />
                    </section>
                    <section className='flex items-center text-xs space-x-3'>
                        <span className='font-medium'>Trạng thái:</span>
                        <Select
                            title='Chọn lựa...'
                            data={[
                                'Chưa phản hồi',
                                'Đã phản hồi',
                                'Đã phản hồi gần đây'
                            ]}
                        />
                    </section>
                    <section className='flex items-center text-xs space-x-3'>
                        <span>Thời gian:</span>
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
                    </section>
                </div>
            </section>
            <div className='flex items-center justify-between'>
                <div className='basis-1/3'>
                    <div className='space-y-3 w-fit h-full px-8 py-2 mx-auto'>
                        <h3 className='text-base font-medium'>Total Reviews</h3>
                        <div className='flex items-center space-x-3'>
                            <h2 className='text-2xl font-semibold drop-shadow-md'>
                                10.0k
                            </h2>
                            <Tag
                                color='blue'
                                className='flex items-center space-x-1 shadow-md'
                            >
                                <span>21%</span>
                                <span>
                                    <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                        strokeWidth={1}
                                        stroke='currentColor'
                                        className='w-3 h-3'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            d='M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941'
                                        />
                                    </svg>
                                </span>
                            </Tag>
                        </div>
                        <div className='text-[14px] text-gray-400'>
                            Tổng đánh giá
                        </div>
                    </div>
                </div>
                <div className='h-[130px] w-[1px] bg-gray-200' />
                <section className='basis-1/3'>
                    <div className='space-y-3 w-fit h-full px-8 py-2 mx-auto'>
                        <h3 className='text-base font-medium'>
                            Average Rating
                        </h3>
                        <div className='flex items-center space-x-3'>
                            <h2 className='text-2xl font-semibold drop-shadow-lg'>
                                4.0
                            </h2>
                            <Rate
                                className='drop-shadow-lg'
                                allowHalf
                                defaultValue={2.5}
                            />
                        </div>
                        <div className='text-[14px] text-gray-400'>
                            Trung bình số sao đánh giá
                        </div>
                    </div>
                </section>
                <div className='h-[130px] w-[1px] bg-gray-200' />
                <section className='basis-1/3'>
                    <div className='w-fit h-full px-8 py-2 mx-auto'>
                        <RatingPercent
                            numberStart={5}
                            color='#0958d9'
                            percent={90}
                        />
                        <RatingPercent
                            numberStart={4}
                            color='#13c2c2'
                            percent={80}
                        />
                        <RatingPercent
                            numberStart={3}
                            color='#52c41a'
                            percent={70}
                        />
                        <RatingPercent
                            numberStart={2}
                            color='#fa8c16'
                            percent={60}
                        />
                        <RatingPercent
                            numberStart={1}
                            color='#f5222d'
                            percent={50}
                        />
                    </div>
                </section>
            </div>
            <div className='grid grid-cols-3 gap-5 py-5'>
                {Array(10)
                    .fill(0)
                    .map((_, i) => (
                        <CommentCard key={i} />
                    ))}
            </div>
        </motion.section>
    )
}

export default Views
