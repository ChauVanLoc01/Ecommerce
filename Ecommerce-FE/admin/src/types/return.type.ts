export type Return<T> = {
    msg: string
    result: T
}


export type Reject = {
    error: string
    message: string
    statusCode: number
}