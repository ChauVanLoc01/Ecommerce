import { Link } from 'react-router-dom'

import Image from 'src/components/Image'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from 'src/components/Shadcn/carousel'
import { Progress } from 'src/components/Shadcn/progress'

import Countdown from './Countdown'

const FlashSale = () => {
    return (
        <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
                <h3 className='font-semibold font-mono text-3xl bg-gradient-to-tr to-[#fcb045] via-[#fd1d1d] from-[#833ab4] bg-clip-text text-transparent'>
                    Flash Sale
                </h3>
                <Countdown targetTime={new Date(2024, 3, 6, 23, 59)} />
            </div>
            <Carousel className='w-full'>
                <CarouselContent className=''>
                    {Array.from({ length: 12 }).map((_, idx) => (
                        <CarouselItem key={idx} className='basis-1/5'>
                            <section className='rounded-12 p-12 bg-[#FFFFFF] space-y-2'>
                                <Link to={'/aaaa'}>
                                    <Image
                                        src='https://ableproadmin.com/react/static/media/prod-5.51c518a97f9ee4861176.png'
                                        alt='product-flash-sale'
                                        className='object-cover'
                                    />
                                </Link>
                                <div className='space-y-2'>
                                    <h3 className='text-red-600 text-sm font-semibold leading-5 text-center'>
                                        100.000đ
                                    </h3>
                                    <Progress value={33} />
                                </div>
                            </section>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default FlashSale
