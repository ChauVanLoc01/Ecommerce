import { useState } from 'react'

import { LuMinus, LuPlus } from 'react-icons/lu'

const InputNumber = () => {
    const [quantity, setQuantity] = useState<number>(1)

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('target', e.target)
        console.log('currentTarget', e.currentTarget)
    }

    const handleMinus = () => {
        quantity > 1 && setQuantity(quantity - 1)
    }

    const handlePlus = () => {
        setQuantity(quantity + 1)
    }

    return (
        <div className='flex items-center bg-[#FFFFFF] rounded border border-border/30 flex-grow-0 w-fit'>
            <button
                type='button'
                className='size-8 flex justify-center items-center leading-10 text-gray-600 transition hover:opacity-75'
                onClick={handleMinus}
            >
                <LuMinus />
            </button>
            <input
                type='text'
                id='Quantity'
                className='h-5 w-14 border-transparent text-center text-xs flex justify-center items-center'
                value={quantity}
                onChange={handleOnChange}
            />
            <button
                type='button'
                className='size-8 flex justify-center items-center leading-10 text-gray-600 transition hover:opacity-75'
                onClick={handlePlus}
            >
                <LuPlus />
            </button>
        </div>
    )
}

export default InputNumber
