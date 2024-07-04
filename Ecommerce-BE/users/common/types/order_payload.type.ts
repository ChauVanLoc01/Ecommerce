import { CreateOrderDTO } from 'common/dtos/create_order.dto'
import { CurrentUserType } from './current.type'

export type OrderPayload = {
    user: CurrentUserType
    body: InstanceType<typeof CreateOrderDTO>
}
