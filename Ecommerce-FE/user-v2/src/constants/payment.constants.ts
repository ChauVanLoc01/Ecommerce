import { Payment } from 'src/types/payment.type'

export const payment_data: { key: Payment; lable: string }[] = [
    {
        key: '',
        lable: 'QR'
    },
    {
        key: 'VNPAYQR',
        lable: 'App'
    },
    {
        key: 'VNBANK',
        lable: 'ATM'
    },
    {
        key: 'INTCARD',
        lable: 'VISA'
    }
]
