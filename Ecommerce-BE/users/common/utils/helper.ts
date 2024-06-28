export const hash = (type: 'order' | 'product' | 'voucher', id: string) => `${type}::${id}`
