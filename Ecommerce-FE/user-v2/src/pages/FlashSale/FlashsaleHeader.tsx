import { Spinner, Text } from '@radix-ui/themes'
import { add, format, isEqual, startOfHour, sub } from 'date-fns'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { hourFormat } from 'src/constants/date-format'
import { SalePromotionIds } from 'src/types/sale.type'
import { cn } from 'src/utils/utils.ts'

type FlashsaleHeaderProps = {
    salePromotions?: SalePromotionIds['result']
}

const FlashsaleHeader = ({ salePromotions }: FlashsaleHeaderProps) => {
    return (
        <div>
            <Carousel className='w-full rounded-6'>
                <CarouselContent className='ml-0'>
                    {salePromotions ? (
                        salePromotions.map(({ id, startDate }) => (
                            <div
                                id={id}
                                className={cn(
                                    'flex justify-center items-center py-4 basis-[12%] flex-shrink-0 bg-gray-400 hover:cursor-pointer hover:bg-gray-600',
                                    {
                                        'bg-orange-500': isEqual(
                                            startDate,
                                            add(startOfHour(new Date()), { hours: 7 }).toISOString()
                                        )
                                    }
                                )}
                            >
                                <Text className='text-white font-bold'>
                                    {format(sub(startDate, { hours: 7 }), hourFormat)}
                                </Text>
                            </div>
                        ))
                    ) : (
                        <div className='flex flex-row flex-wrap basis-1/5 flex-shrink-0'>
                            <Spinner />
                        </div>
                    )}
                </CarouselContent>
                <CarouselPrevious type='button' />
                <CarouselNext type='button' />
            </Carousel>
        </div>
    )
}

export default FlashsaleHeader
