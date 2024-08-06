export const startProductDetailFetching = 'start-product-detail-fetching'

export const endProductDetailFetching = 'end-product-detail-fetching'

export const profileEvent = 'set-profile'

export const exitEvent = 'exit-web'

export const startLoadingLoader = 'startLoadingLoader'

export const endLoadingLoader = 'endLoadingLoader'

export const join_room = 'join-room'

export const leave_room = 'leave-room'

export const current_sale_promotion = 'current_sale_promotion'

export const updateProductInCart = 'update::product::in::cart'

export const updateProductInCartEvent = new Event(updateProductInCart)

export const channel = {
    order: 'order',
    product: 'product',
    voucher: 'voucher',
    transaction: 'transaction',
    current_sale_promotion: 'current_sale_promotion',
    sale_promotion: 'sale-promotion'
}
