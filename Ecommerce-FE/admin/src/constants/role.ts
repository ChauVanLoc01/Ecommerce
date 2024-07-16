enum SERVICE {
    'Overview' = 'Overview',
    'FlashSale' = 'FlashSale',
    'Product' = 'Product',
    'Order' = 'Order',
    'Employee' = 'Employee',
    'Rating' = 'Rating',
    'Voucher' = 'Voucher'
}

type ACTION = 'Create' | 'Update' | 'Delete'

type OBJECT = 'STORE_OWNER' | 'EMPLOYEE'

type RoleType = Record<OBJECT, Record<SERVICE, ACTION[]>>

export const ROLE: RoleType = {
    STORE_OWNER: {
        Overview: ['Create', 'Delete', 'Update'],
        FlashSale: ['Create', 'Delete', 'Update'],
        Product: ['Create', 'Delete', 'Update'],
        Order: ['Create', 'Delete', 'Update'],
        Employee: ['Create', 'Delete', 'Update'],
        Rating: ['Create', 'Delete', 'Update'],
        Voucher: ['Create', 'Delete', 'Update']
    },
    EMPLOYEE: {
        Overview: ['Create', 'Delete', 'Update'],
        FlashSale: ['Create', 'Delete', 'Update'],
        Product: ['Create', 'Delete', 'Update'],
        Order: ['Create', 'Delete', 'Update'],
        Employee: ['Create', 'Delete', 'Update'],
        Rating: ['Create', 'Delete', 'Update'],
        Voucher: ['Create', 'Delete', 'Update']
    }
}
