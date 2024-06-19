import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Flex, Grid, IconButton, Tooltip } from '@radix-ui/themes'
import { add, eachDayOfInterval, endOfWeek, format, setHours, startOfWeek, sub } from 'date-fns'
import { Dictionary } from 'lodash'
import { useMemo, useRef, useState } from 'react'
import SimpleBar from 'simplebar-react'
import { SalePromotion, StoreWithProductSalePromotion } from 'src/types/sale.type'
import { cn } from 'src/utils/utils'
import { hours } from './data'

type CalendarProps = {
    promotionObjs: Dictionary<SalePromotion>
    storePromotionObj: Dictionary<StoreWithProductSalePromotion>
    onSelectEvent: (event: SalePromotion) => () => void
}

const Calendar = ({ promotionObjs, onSelectEvent, storePromotionObj }: CalendarProps) => {
    const parentRef = useRef<HTMLDivElement | null>(null)
    const scrollableNodeRef = useRef<HTMLDivElement | null>(null)

    const [currentDate, setCurrentDate] = useState<Date>(new Date())

    const dayInWeek = useMemo(
        () =>
            eachDayOfInterval({
                start: add(startOfWeek(currentDate), { hours: 7 }),
                end: add(endOfWeek(currentDate), { hours: 7 })
            }).slice(0, -1),
        [currentDate]
    )

    const totalDate = useMemo(() => {
        return hours.reduce((acum: string[], _, hour) => {
            return [...acum, ...dayInWeek.map((e) => setHours(e, hour).toISOString())]
        }, [])
    }, [dayInWeek])

    const handleChangeDate = (type: 'previous' | 'next') => () => {
        setCurrentDate((pre) => {
            if (type === 'previous') {
                return sub(pre, { days: 7 })
            }
            return add(pre, { days: 7 })
        })
    }

    return (
        <div ref={parentRef}>
            <SimpleBar
                style={{
                    maxHeight: 600,
                    paddingRight: 8,
                    maxWidth: `${parentRef?.current?.clientWidth}px`
                }}
                scrollableNodeProps={{ ref: scrollableNodeRef }}
            >
                <Flex direction={'column'}>
                    <HeaderCalendar
                        parentRef={parentRef}
                        scrollableNodeRef={scrollableNodeRef}
                        dayInWeek={dayInWeek}
                        handleChangeDate={handleChangeDate}
                    />
                    <Flex>
                        <SideHour />
                        <div className='grid grid-cols-7 grid-rows-[24] h-[900px] w-[1600px]'>
                            {totalDate.map((date, idx) => (
                                <div
                                    key={`${date}-${idx}`}
                                    className={cn(
                                        'p-2 h-16 border border-gray-300 border-r-0 border-b-0 [&:nth-child(7n)]:border-r',
                                        {
                                            'border-b': idx > 7 * 24 - 8
                                        }
                                    )}
                                >
                                    <button
                                        type='button'
                                        className={cn('rounded-6 w-full h-full p-1 text-xs', {
                                            'bg-cyan-500 text-white hover:bg-cyan-600': promotionObjs[date],
                                            'bg-green-600 hover:bg-green-700':
                                                storePromotionObj?.[promotionObjs?.[date]?.id]
                                        })}
                                        onClick={onSelectEvent(promotionObjs?.[date])}
                                    >
                                        {promotionObjs?.[date]?.title}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Flex>
                </Flex>
            </SimpleBar>
        </div>
    )
}

type HeaderCalendarProps = {
    parentRef: React.MutableRefObject<HTMLDivElement | null>
    scrollableNodeRef: React.MutableRefObject<HTMLDivElement | null>
    dayInWeek: Date[]
    handleChangeDate: (type: 'previous' | 'next') => () => void
}

const HeaderCalendar = ({ parentRef, scrollableNodeRef, dayInWeek, handleChangeDate }: HeaderCalendarProps) => {
    return (
        <Flex
            className={cn(`!w-[${parentRef.current?.offsetWidth}px] sticky top-0 bg-gray-200`, {
                'shadow-md': scrollableNodeRef?.current?.scrollTop
            })}
        >
            <div className='w-36 h-12 border border-gray-300 border-r-0 [&:nth-child(7n)]:border-r flex justify-center items-center space-x-1'>
                <Tooltip content='Tuần vừa rồi'>
                    <IconButton variant='soft' color='gray' onClick={handleChangeDate('previous')}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip content='Tuần kế'>
                    <IconButton variant='soft' color='gray' onClick={handleChangeDate('next')}>
                        <ChevronRightIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <Grid columns={'7'} rows={'1'} className='flex-grow'>
                {dayInWeek.map((e) => (
                    <div
                        key={e.toISOString()}
                        className='w-full h-12 border border-gray-300 border-r-0 [&:nth-child(7n)]:border-r flex justify-center items-center'
                    >
                        {format(e, 'EEEEEE dd-MM-yyyy')}
                    </div>
                ))}
            </Grid>
        </Flex>
    )
}

const SideHour = () => {
    return (
        <div className='grid grid-cols-1 grid-rows-[24] w-44 bg-gray-100'>
            {hours.map((hour) => (
                <div
                    key={hour}
                    className='h-16 border border-gray-300 border-b-0 border-r-0 [&:last-child]:border-b flex items-center justify-center'
                >
                    {hour}
                </div>
            ))}
        </div>
    )
}

export default Calendar
