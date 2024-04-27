'use client'

import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from 'src/components/Shadcn/button'
import { Calendar } from 'src/components/Shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/Shadcn/popover'
import { cn } from 'src/utils/utils.ts'

type DatePicker = {
    date: Date | undefined
    setDate: React.Dispatch<React.SetStateAction<Date | undefined>>
}

export function DatePicker({ date, setDate }: DatePicker) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn(
                        'w-full flex justify-between font-normal !text-sm',
                        !date && 'text-muted-foreground',
                        'hover:bg-white group tracking-wider px-4 py-2 rounded-lg border-border/30'
                    )}
                >
                    {date ? (
                        format(date, 'dd / MM / yyyy', {
                            locale: vi
                        })
                    ) : (
                        <span></span>
                    )}
                    <CalendarIcon className='h-4 w-4 !text-gray-500 !group-hover:text-gray-600' />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
                <Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
        </Popover>
    )
}
