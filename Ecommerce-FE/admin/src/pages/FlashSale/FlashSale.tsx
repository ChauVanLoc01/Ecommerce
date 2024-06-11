import { format, getDay, parse, startOfWeek } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Calendar, dateFnsLocalizer, EventPropGetter, SlotPropGetter } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
    vi: vi
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
})

const FlashSale = () => {
    const onSelectEvent = () => {
        console.log('select event fire')
    }

    const slotPropGetter: SlotPropGetter = (date: Date, resourceId?: number | string) => {
        return {
            style: {
                backgroundColor: '#000'
            }
        }
    }

    return (
        <Calendar
            localizer={localizer}
            culture='vi'
            startAccessor='start'
            endAccessor='end'
            style={{ height: 650 }}
            messages={{
                today: 'Hôm nay',
                week: 'Tuần',
                day: 'Ngày',
                month: 'Tháng',
                yesterday: 'Ngày hôm qua',
                allDay: 'Tất cả các ngày',
                next: 'Kế tiếp',
                event: 'Sự kiện',
                noEventsInRange: 'Không có sự kiện',
                previous: 'Quay lại',
                showMore: (count) => (!count ? 'Hết' : 'Xem thêm'),
                tomorrow: 'Ngày mai',
                time: 'Thời gian',
                work_week: 'Tuần làm việc',
                agenda: 'Sự kiện'
            }}
            selectable
            step={30}
            views={{ month: true, week: true, agenda: true }}
            onSelectSlot={onSelectEvent}
            slotPropGetter={slotPropGetter}
        />
    )
}

export default FlashSale
