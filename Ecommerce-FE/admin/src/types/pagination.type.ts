export type Order = 'asc' | 'desc'

export type Pagination = Partial<{
    limit: number
    page: number
    page_size: number
}>
