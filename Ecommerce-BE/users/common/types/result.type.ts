export type Return = {
    msg: string
    result: any
}

export type MessageReturn<T = any> = {
    msg: string
    action: boolean
    result: T
}
