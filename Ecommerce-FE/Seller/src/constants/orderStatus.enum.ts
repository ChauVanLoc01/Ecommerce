export enum orderStatus {
    confirm = 'confirm',
    waitingShiper = 'waiting',
    shipperIsShipping = 'shipping',
    shippingSuccess = 'shipped',
    success = 'success',
    cancel = 'cancel',
    refund = 'refund'
}

export const orderColor = {
    confirm: '#f1c40f',
    waiting: '#d9d9d9',
    shipping: '#bfbfbf',
    shipped: '#8c8c8c',
    success: '#1abc9c',
    cancel: '#e74c3c',
    refund: '#8e44ad'
}
