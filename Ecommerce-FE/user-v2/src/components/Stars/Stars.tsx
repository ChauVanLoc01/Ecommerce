import { StarFilledIcon, StarIcon } from '@radix-ui/react-icons'

type StarsProps = {
    rating: number
    size?: number
}

const Stars = ({ rating, size = 40 }: StarsProps) => {
    const handleWidth = (order: number) => {
        if (order <= rating) {
            return '100%'
        }
        if (order > rating && order - rating < 1) {
            return (rating - Math.floor(rating)) * 100 + '%'
        }
        return '0%'
    }

    return (
        <div className='flex items-center'>
            {Array(5)
                .fill(0)
                .map((_, index) => (
                    <div className='relative' style={{ width: handleWidth(index + 1) }}>
                        <div className='absolute inline-block z-10'>
                            <StarFilledIcon width={size} height={size} color='yellow' />
                        </div>
                        <div className='absolute inline-block z-20'>
                            <StarIcon width={size} height={size} className='!text-white' />
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default Stars
