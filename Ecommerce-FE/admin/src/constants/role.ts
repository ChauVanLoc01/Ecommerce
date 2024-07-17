import { route } from './route'

export enum SERVICE {
    'Overview' = 'Overview',
    'FlashSale' = 'FlashSale',
    'Product' = 'Product',
    'Order' = 'Order',
    'Employee' = 'Employee',
    'Rating' = 'Rating',
    'Voucher' = 'Voucher',
    'Store' = 'Store',
    'User' = 'User'
}

export const SERVICE_NAME: Record<SERVICE, { label: string; path: string; icon: string }> = {
    [SERVICE.Overview]: {
        label: 'Tổng quan',
        path: `/${route.analytic}`,
        icon: 'HomeIcon'
    },
    [SERVICE.FlashSale]: {
        label: 'Flash Sale',
        path: `/${route.flashSale}`,
        icon: 'CiDiscount1'
    },
    [SERVICE.Product]: {
        label: 'Sản phẩm',
        path: route.product,
        icon: 'CubeIcon'
    },
    [SERVICE.Order]: {
        label: 'Đơn hàng',
        path: route.order,
        icon: 'FileTextIcon'
    },
    [SERVICE.Employee]: {
        label: 'Nhân viên',
        path: route.employee,
        icon: 'PersonIcon'
    },
    [SERVICE.Rating]: {
        label: 'Đánh giá',
        path: route.rating,
        icon: 'StarIcon'
    },
    [SERVICE.Voucher]: {
        label: 'Mã giảm giá',
        path: route.voucher,
        icon: 'IdCardIcon'
    },
    [SERVICE.Store]: {
        label: 'Cửa hàng',
        path: route.store,
        icon: 'IoStorefrontOutline'
    },
    [SERVICE.User]: {
        label: 'Người dùng',
        path: route.user,
        icon: 'IoStorefrontOutline'
    }
}

export type ACTION = 'Detail' | 'Create' | 'Update' | 'Delete' | 'Full' | 'ADMIN'

export type OBJECT = 'STORE_OWNER' | 'EMPLOYEE' | 'ADMIN'

export type RoleType = Record<OBJECT, Record<Partial<SERVICE>, ACTION[]>>

export const ROLE: RoleType = {
    ADMIN: {
        Overview: ['ADMIN'],
        FlashSale: ['ADMIN'],
        Product: [],
        Order: [],
        Employee: [],
        Rating: [],
        Voucher: ['ADMIN'],
        Store: ['ADMIN'],
        User: ['ADMIN']
    },
    STORE_OWNER: {
        Overview: ['Full'],
        FlashSale: ['Full'],
        Product: ['Full'],
        Order: ['Full'],
        Employee: ['Full'],
        Rating: ['Full'],
        Voucher: ['Full'],
        Store: [],
        User: []
    },
    EMPLOYEE: {
        Overview: [],
        FlashSale: ['Create', 'Delete', 'Update'],
        Product: ['Create', 'Delete', 'Update'],
        Order: ['Update'],
        Employee: [],
        Rating: ['Update'],
        Voucher: ['Create', 'Delete', 'Update'],
        Store: [],
        User: []
    }
}
