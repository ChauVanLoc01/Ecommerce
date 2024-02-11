type RatingPercentProps = {
    color: string
    percent: number
    numberStart: number
}

const RatingPercent = ({ color, percent, numberStart }: RatingPercentProps) => {
    return (
        <div className='flex items-center justify-start w-full space-x-3'>
            <div className='flex items-center'>
                <span className='mr-2 text-gray-400'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={1}
                        stroke='currentColor'
                        className='w-3 h-3 drop-shadow-md'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                        />
                    </svg>
                </span>
                <span className='text-[14px] font-semibold'>{numberStart}</span>
            </div>
            <div className='w-[70%] min-w-[200px]'>
                <div
                    className='rounded-full h-1 drop-shadow-md'
                    style={{ width: `${percent}%`, backgroundColor: color }}
                />
            </div>
            <span className='text-[14px]'>11.2k</span>
        </div>
    )
}

export default RatingPercent
