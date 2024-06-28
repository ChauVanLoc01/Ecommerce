import { Flex, IconButton } from '@radix-ui/themes'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa6'

type RatingProps = {
    defaultValue?: number
    handleRating?: (rateNum: number) => void
}

const Rating = ({ defaultValue, handleRating }: RatingProps) => {
    const [position, setPosition] = useState<{ click?: number; hover?: number }>({})

    const handleMouse = (type: 'click' | 'hover', index: number) => () => {
        setPosition((pre) => ({ ...pre, [type]: index }))
        if (type === 'click' && handleRating) {
            handleRating(index + 1)
        }
    }

    const handleMouseLeave = () =>
        setPosition((pre) => {
            delete pre.hover
            return {
                ...pre
            }
        })

    return (
        <Flex className='space-x-1'>
            {Array(5)
                .fill(0)
                .map((_, idx) => (
                    <IconButton
                        key={idx}
                        onClick={handleMouse('click', idx)}
                        onMouseEnter={handleMouse('hover', idx)}
                        onMouseLeave={handleMouseLeave}
                        variant='ghost'
                        color='yellow'
                        className='hover:bg-[#FFFFFF] hover:cursor-pointer'
                        type='button'
                    >
                        <FaStar
                            data-click={idx <= (position?.click || -1)}
                            data-hover={idx <= (position?.hover || -1)}
                            className='size-6 fill-gray-300 data-[click=true]:fill-yellow-400 data-[hover=true]:fill-yellow-400'
                        />
                    </IconButton>
                ))}
        </Flex>
    )
}

export default Rating
