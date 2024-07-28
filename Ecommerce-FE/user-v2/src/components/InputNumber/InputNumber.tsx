import { Flex, Text } from '@radix-ui/themes'
import { LuMinus, LuPlus } from 'react-icons/lu'
import { cn } from 'src/utils/utils.ts'

type InputNumberProps = {
    quantity: number
    setQuantity: React.Dispatch<React.SetStateAction<number>>
    max: number
    isSale?: boolean
}

const InputNumber = ({ quantity, setQuantity, max, isSale }: InputNumberProps) => {
    let isDisable = quantity == 0
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = +e.target.value.replace(/\D/gim, '')
        setQuantity(Math.min(Math.max(value, 1), max))
    }

    const handleMinus = () => {
        if (quantity) {
            setQuantity(Math.max(quantity - 1, 1))
        }
    }

    const handlePlus = () => {
        if (quantity) {
            setQuantity(Math.min(quantity + 1, max))
        }
    }

    return (
        <div>
            <div
                className={cn(
                    'flex items-center bg-[#FFFFFF] rounded border border-border/30 flex-grow-0 w-fit px-1 pt-1 flex-col relative'
                )}
            >
                <Flex align={'center'}>
                    <button
                        className={cn('size-8 flex justify-center items-center leading-10 text-gray-500 transition', {
                            'text-gray-300 cursor-not-allowed': isDisable,
                            'hover:text-gray-900 hover:bg-gray-200 rounded-6': !isDisable
                        })}
                        onClick={handleMinus}
                    >
                        <LuMinus />
                    </button>
                    <input
                        type='text'
                        id='Quantity'
                        className='h-5 w-14 border-transparent text-center text-lg font-semibold font-mono flex justify-center items-center'
                        value={quantity}
                        onChange={handleOnChange}
                    />
                    <button
                        type='button'
                        className={cn('size-8 flex justify-center items-center leading-10 text-gray-500 transition', {
                            'text-gray-300 cursor-not-allowed': isDisable,
                            'hover:text-gray-900 hover:bg-gray-200 rounded-6': !isDisable
                        })}
                        onClick={handlePlus}
                    >
                        <LuPlus />
                    </button>
                </Flex>
                {quantity == 0 ? (
                    <Text className='' size={'1'} color='red'>
                        hết hàng
                    </Text>
                ) : (
                    <Text className='w-full text-center' size={'1'} color='gray'>
                        Số lượng: {max}
                    </Text>
                )}
            </div>
            {isSale && (
                <Flex justify={'center'} mt={'1'}>
                    <Text size={'1'} color='red'>
                        Giới hạn mua: 1
                    </Text>
                </Flex>
            )}
        </div>
    )
}

export default InputNumber
