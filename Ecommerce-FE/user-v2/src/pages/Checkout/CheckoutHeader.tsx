import { cn } from 'src/utils/utils.ts'

type CheckoutHeaderProps = {
    step: number
    handlePreviousStep: (ownStep: number) => () => void
}

const CheckoutHeader = ({ handlePreviousStep, step }: CheckoutHeaderProps) => {
    return (
        <div className='flex rounded-8 border border-border/30 items-center bg-[#FFFFFF]'>
            <button
                onClick={handlePreviousStep(1)}
                className={cn('pl-5 pr-28 py-5 space-x-2', {
                    'text-blue-600': step == 1
                })}
            >
                <span
                    className={cn('px-2 py-1 rounded-full border border-border/40', {
                        'text-white bg-blue-600 border-blue-600': step == 1
                    })}
                >
                    1
                </span>
                <span>Giỏ hàng</span>
            </button>
            <button
                onClick={handlePreviousStep(2)}
                className={cn('pl-5 pr-28 py-5 space-x-2', {
                    'text-blue-600': step == 2
                })}
            >
                <span
                    className={cn('px-2 py-1 rounded-full border border-border/40', {
                        'text-white bg-blue-600 border-blue-600': step == 2
                    })}
                >
                    2
                </span>
                <span>Thông tin vận chuyển</span>
            </button>
            <button
                onClick={handlePreviousStep(3)}
                className={cn('pl-5 pr-28 py-5 space-x-2', {
                    'text-blue-600': step == 3
                })}
            >
                <span
                    className={cn('px-2 py-1 rounded-full border border-border/40', {
                        'text-white bg-blue-600 border-blue-600': step == 3
                    })}
                >
                    3
                </span>
                <span>Thanh toán</span>
            </button>
        </div>
    )
}

export default CheckoutHeader
