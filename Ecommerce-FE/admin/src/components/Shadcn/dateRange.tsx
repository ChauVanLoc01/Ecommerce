import { CalendarIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { PopoverClose } from '@radix-ui/react-popover'
import { Button, Flex, Text, Tooltip } from '@radix-ui/themes'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { cn } from 'src/utils/utils'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type DatePickerWithRangeProps = {
    date: DateRange | undefined
    setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
} & React.HTMLAttributes<HTMLDivElement>

export function DatePickerWithRange({ date, setDate, className }: DatePickerWithRangeProps) {
    const handleClearDate = () => setDate(undefined)

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id='date'
                        variant={'outline'}
                        className={cn(
                            'w-[290px] justify-start text-left font-normal relative',
                            !date && 'text-muted-foreground'
                        )}
                        size={'3'}
                        color='gray'
                    >
                        <Text weight={'medium'}>
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, 'dd/LL/y', {
                                            locale: vi
                                        })}{' '}
                                        -{' '}
                                        {format(date.to, 'dd/LL/y', {
                                            locale: vi
                                        })}
                                    </>
                                ) : (
                                    format(date.from, 'dd-LL-y')
                                )
                            ) : (
                                <span>Bắt đầu - Kết thúc</span>
                            )}
                        </Text>
                        <div className='absolute top-1/2 right-4 -translate-y-1/2 group'>
                            <button className='group-hover:hidden'>
                                <CalendarIcon />
                            </button>
                            <Tooltip content='Xóa'>
                                <button className='hidden group-hover:inline-block' onClick={handleClearDate}>
                                    {[<CrossCircledIcon color='red' />, <CalendarIcon />][+!!!date]}
                                </button>
                            </Tooltip>
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0 rounded-12' align='end'>
                    <Calendar
                        initialFocus
                        mode='range'
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                        locale={vi}
                    />
                    <Flex justify={'end'} className='space-x-3 p-3 text-sm'>
                        <Button
                            onClick={handleClearDate}
                            className='text-red border border-red rounded-6 cursor-pointer hover:bg-red/90 hover:text-white px-3 py-1.5 transition-all ease-linear'
                        >
                            Bỏ chọn
                        </Button>
                        <PopoverClose>
                            <Button className='inline-block border border-blue px-3 py-1.5 bg-blue text-white rounded-6 cursor-pointer hover:bg-blue/80'>
                                Trở về
                            </Button>
                        </PopoverClose>
                    </Flex>
                </PopoverContent>
            </Popover>
        </div>
    )
}
