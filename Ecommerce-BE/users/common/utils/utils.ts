import { UpdateOtherService } from 'common/types/order_payload.type'

export const isProductSale = (
    product: UpdateOtherService['products'][number]
): product is Required<UpdateOtherService['products'][number]> => {
    return 'productPromotionId' in product
}
