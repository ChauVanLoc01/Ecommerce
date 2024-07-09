import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Button, Flex, Grid, IconButton, Tooltip } from '@radix-ui/themes'
import {
    add,
    eachDayOfInterval,
    endOfWeek,
    format,
    isEqual,
    setHours,
    startOfDay,
    startOfHour,
    startOfWeek,
    sub
} from 'date-fns'
import { debounce, DebouncedFunc, Dictionary } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
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
    const scrollableNodeRef = useRef<any>(null)
    const [onTop, setOnTop] = useState<boolean>(true)

    const handleCheckPositionScrollTop: DebouncedFunc<(isOnTop: boolean) => void> = debounce(
        (isOnTop: boolean) => setOnTop(isOnTop),
        200
    )

    useEffect(() => {
        if (scrollableNodeRef?.current) {
            scrollableNodeRef.current.addEventListener('scroll', () => {
                handleCheckPositionScrollTop(!!!scrollableNodeRef.current.scrollTop)
            })
        }
        return () => handleCheckPositionScrollTop.cancel()
    }, [])

    const [currentDate, setCurrentDate] = useState<Date>(new Date())

    const dayInWeek = useMemo(
        () =>
            eachDayOfInterval({
                start: startOfWeek(currentDate),
                end: endOfWeek(currentDate)
            }),
        [currentDate]
    )

    const totalDate = useMemo(() => {
        return hours.reduce((acum: string[], _, hour) => {
            return [...acum, ...dayInWeek.map((e) => setHours(e, hour + 7).toISOString())]
        }, [])
    }, [dayInWeek])

    const handleChangeDate = (type: 'previous' | 'next') => () => {
        setCurrentDate((pre) => {
            if (type === 'previous') {
                return startOfDay(sub(pre, { days: 4 }))
            }
            return startOfDay(add(pre, { days: 4 }))
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
                        onTop={onTop}
                        parentRef={parentRef}
                        dayInWeek={dayInWeek}
                        handleChangeDate={handleChangeDate}
                        setCurrentDate={setCurrentDate}
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
                                            'border-b': idx > 7 * 24 - 8,
                                            'bg-orange-200': isEqual(startOfHour(new Date()), sub(date, { hours: 7 }))
                                        }
                                    )}
                                    data-date={date}
                                >
                                    <button
                                        type='button'
                                        className={cn('rounded-6 w-full h-full p-1 text-xs', {
                                            'bg-cyan-500 text-white hover:bg-cyan-600': promotionObjs[date],
                                            'bg-green-600 hover:bg-green-700 relative z-10':
                                                storePromotionObj?.[promotionObjs?.[date]?.id]
                                        })}
                                        onClick={onSelectEvent(promotionObjs?.[date])}
                                    >
                                        {promotionObjs?.[date]?.title}
                                        {!!storePromotionObj?.[promotionObjs?.[date]?.id] && (
                                            <span className='absolute -top-2 -right-1 w-4 h-4 bg-red text-white rounded-full text-[10px] flex justify-center items-center'>
                                                {storePromotionObj?.[promotionObjs?.[date]?.id].ProductPromotion.length}
                                            </span>
                                        )}
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
    dayInWeek: Date[]
    handleChangeDate: (type: 'previous' | 'next') => () => void
    onTop: boolean
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
}

const HeaderCalendar = ({ parentRef, dayInWeek, handleChangeDate, onTop, setCurrentDate }: HeaderCalendarProps) => {
    return (
        <Flex
            className={cn(`!w-[${parentRef.current?.offsetWidth}px] sticky top-0 bg-gray-200`, {
                'shadow-md': !onTop
            })}
        >
            <div className='w-36 h-12 border border-gray-300 border-r-0 [&:nth-child(7n)]:border-r flex justify-center items-center space-x-1'>
                <Button size={'1'} onClick={() => setCurrentDate(new Date())}>
                    Hôm nay
                </Button>
                <Tooltip content='Tuần vừa rồi'>
                    <IconButton variant='soft' color='gray' onClick={handleChangeDate('previous')} size={'1'}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip content='Tuần kế'>
                    <IconButton variant='soft' color='gray' onClick={handleChangeDate('next')} size={'1'}>
                        <ChevronRightIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <Grid columns={'7'} rows={'1'} className='flex-grow'>
                {dayInWeek.map((e) => (
                    <div
                        key={e.toISOString()}
                        data-date={e}
                        className={cn(
                            'w-full h-12 border border-gray-300 border-r-0 [&:nth-child(7n)]:border-r flex justify-center items-center',
                            {
                                'bg-orange-500 text-white': isEqual(startOfDay(new Date()), e)
                            }
                        )}
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
