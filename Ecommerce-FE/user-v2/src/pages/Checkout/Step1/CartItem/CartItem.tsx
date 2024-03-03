import { RiDeleteBin5Line } from 'react-icons/ri'

import InputNumber from 'src/components/InputNumber'

const CartItem = () => {
    return (
        <div className='p-24 space-x-5 flex items-center bg-[#FFFFFF] rounded-8 border border-border/30'>
            <div className='w-16 h-16 rounded-12 p-1 border border-border/30'>
                <img
                    src='	https://ableproadmin.com/react/static/media/prod-8.7d6a537de6b76b3f24af.png'
                    alt='cart-item'
                    className='object-cover'
                />
            </div>
            <div className='space-y-2 flex-grow'>
                <h3 className='font-semibold line-clamp-2'>
                    Apple Iphone 13 Pro
                </h3>
                <h3 className='text-gray-400'>Red</h3>
            </div>
            <div className='flex items-center space-x-4'>
                <h3 className='font-semibold'>100.000đ</h3>
                <InputNumber />
                <button className='p-12 rounded-6 hover:bg-gray-100'>
                    <RiDeleteBin5Line className='text-red-600' />
                </button>
            </div>
        </div>
    )
}

export default CartItem
