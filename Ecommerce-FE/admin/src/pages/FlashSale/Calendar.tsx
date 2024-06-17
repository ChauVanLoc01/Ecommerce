import { Text } from '@radix-ui/themes'
import { format, getDay, parse, startOfWeek, sub } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Dictionary } from 'lodash'
import { Calendar as CalendarLib, dateFnsLocalizer, Event } from 'react-big-calendar'
import { SalePromotion, StoreSalePromotion } from 'src/types/sale.type'

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

type CalendarProps = {
    data:
        | {
              promotions: SalePromotion[]
              storePromotionObj: Dictionary<StoreSalePromotion>
          }
        | undefined
    onSelectEvent: (event: any) => void
}

const Calendar = ({ data, onSelectEvent }: CalendarProps) => {
    return (
        <CalendarLib
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
            step={60}
            timeslots={1}
            views={{ month: true, week: true }}
            events={
                (data?.promotions.map((promotion) => ({
                    title: <Text>{promotion.title}</Text>,
                    start: sub(new Date(promotion.startDate), { hours: 7 }),
                    end: sub(new Date(promotion.endDate), { hours: 7 }),
                    resource: { ...promotion, isCreated: data.storePromotionObj[promotion.id] }
                })) as Event[]) || []
            }
            eventPropGetter={(e) => {
                if (e.resource['isCreated']) {
                    return { style: { backgroundColor: 'blueviolet' } }
                }
                return { style: { backgroundColor: 'gray' } }
            }}
            onSelectEvent={(e, _) => onSelectEvent(e)}
        />
    )
}

export default Calendar
