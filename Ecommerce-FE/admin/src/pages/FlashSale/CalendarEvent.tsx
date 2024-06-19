import { Dictionary } from 'lodash'
import { SalePromotion, StoreWithProductSalePromotion } from 'src/types/sale.type'
import Calendar from './Calendar'

type CalendarProps = {
    promotionObjs: Dictionary<SalePromotion>
    onSelectEvent: (event: SalePromotion) => () => void
    storePromotionObj: Dictionary<StoreWithProductSalePromotion>
}

const CalendarEvent = ({ promotionObjs, onSelectEvent, storePromotionObj }: CalendarProps) => {
    return (
        <Calendar promotionObjs={promotionObjs} onSelectEvent={onSelectEvent} storePromotionObj={storePromotionObj} />
    )
}

export default CalendarEvent
