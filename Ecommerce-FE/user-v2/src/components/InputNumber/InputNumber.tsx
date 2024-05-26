import { Text } from '@radix-ui/themes'
import { LuMinus, LuPlus } from 'react-icons/lu'
import { cn } from 'src/utils/utils.ts'

type InputNumberProps = {
    quantity: number
    setQuantity: React.Dispatch<React.SetStateAction<number>>
    currentQuantity: number
}

const InputNumber = ({ quantity, setQuantity, currentQuantity }: InputNumberProps) => {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('target', e.target)
        console.log('currentTarget', e.currentTarget)
    }

    const handleMinus = () => {
        currentQuantity && quantity > 1 && setQuantity(quantity - 1)
    }

    const handlePlus = () => {
        currentQuantity && quantity < currentQuantity && setQuantity(quantity + 1)
    }

    return (
        <div
            className={cn(
                'flex items-center bg-[#FFFFFF] rounded border border-border/30 flex-grow-0 w-fit relative pb-2'
            )}
        >
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
                className='h-5 w-14 border-transparent text-center text-sm font-semibold font-mono flex justify-center items-center'
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
            {!currentQuantity ? (
                <Text className='absolute left-1/2 -translate-x-1/2 bottom-0' size={'1'} color='red'>
                    hết hàng
                </Text>
            ) : (
                <Text
                    className='absolute left-1/2 -translate-x-1/2 bottom-0 w-full text-center'
                    size={'1'}
                    color='gray'
                >
                    Số lượng: {currentQuantity}
                </Text>
            )}
        </div>
    )
}

export default InputNumber
