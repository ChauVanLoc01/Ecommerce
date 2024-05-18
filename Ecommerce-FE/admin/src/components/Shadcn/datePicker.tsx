import { CrossCircledIcon } from '@radix-ui/react-icons'
import { Button, Flex, Popover, Text } from '@radix-ui/themes'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { SelectSingleEventHandler } from 'react-day-picker'
import { cn } from 'src/utils/utils'
import { Calendar } from './calendar'

type DatePickerProps = {
    date: Date | undefined
    onSelect: SelectSingleEventHandler
    resetField: () => void
}

export function DatePicker({ date, onSelect, resetField }: DatePickerProps) {
    const handleReset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        resetField()
    }

    return (
        <Popover.Root>
            <Popover.Trigger>
                <Button
                    variant={'outline'}
                    className={cn(!date, 'group w-[190px] !flex !justify-between')}
                    color='gray'
                >
                    <Text size={'2'}>{date ? format(date, 'dd - MM - yyyy') : 'Chọn thời gian'}</Text>
                    <Flex gapX={'2'} align={'center'}>
                        {date && (
                            <button type='button' onClick={handleReset}>
                                <CrossCircledIcon className={cn('hidden group-hover:inline-block hover:text-red')} />
                            </button>
                        )}
                        <CalendarIcon className='flex-shrink-0 h-3 w-3' />
                    </Flex>
                </Button>
            </Popover.Trigger>
            <Popover.Content className='w-auto p-0'>
                <Calendar mode='single' selected={date} onSelect={onSelect} locale={vi} initialFocus />
            </Popover.Content>
        </Popover.Root>
    )
}
