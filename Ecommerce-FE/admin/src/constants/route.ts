import { OBJECT } from './role'

export const route = {
    root: '/',
    login: 'login',
    store: 'store',
    order: 'order',
    product: 'product',
    profile: 'profile',
    changePassword: 'change-password',
    permission: 'permission',
    setting: 'setting',
    analytic: 'analytic',
    employee: 'employee',
    voucher: 'voucher',
    rating: 'rating',
    flashSale: 'flash-sale',
    user: 'user',
    over_view: 'over_view'
}

export const route_default_with_role: Record<OBJECT, string> = {
    ADMIN: route.over_view,
    STORE_OWNER: route.voucher,
    EMPLOYEE: route.voucher
}
