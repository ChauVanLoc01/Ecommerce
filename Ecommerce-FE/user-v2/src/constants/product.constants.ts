export const getSort = (s: string) => {
    return {
        key: s.split('_')[0],
        value: s.split('_')[1]
    }
}

export const product_list_sort: [string, string][] = [
    ['createdAt_desc', 'Mới nhất'],
    ['sold_desc', 'Bán chạy nhất'],
    ['price_asc', 'Giá từ thấp đến cao'],
    ['price_desc', 'Giá từ cao đến thấp']
]

export const sort_key = ['createdAt', 'sold', 'price']

export enum product_status {
    ACTIVE = 'ACTIVE',
    BLOCK = 'BLOCK'
}
