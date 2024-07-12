export enum BackgroundAction {
    sendMail = 'sendMail',
    register = 'register',
    forgetPassword = 'forgotPassword',
    addToCache = 'addToCache',
    createOrder = 'createOrder',
    changeQuantityProduct = 'changeQuantityProduct',
    reUpdateIsDrafOrder = 'reUpdateIsDrafOrder',
    rollBackOrder = 'rollBackOrder'
}

export enum BackgroundName {
    mail = 'sendMail',
    product = 'product',
    order = 'order'
}
