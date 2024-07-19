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
    user: 'user'
}

export const route_default_with_role: Record<OBJECT, string> = {
    ADMIN: route.analytic,
    STORE_OWNER: route.analytic,
    EMPLOYEE: route.order
}
