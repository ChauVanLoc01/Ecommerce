export enum BackgroundAction {
    sendMail = 'sendMail',
    register = 'register',
    forgetPassword = 'forgotPassword',
    addToCache = 'addToCache',
    createOrder = 'createOrder',
    changeQuantityProduct = 'changeQuantityProduct',
    reUpdateIsDrafOrder = 'reUpdateIsDrafOrder',
    rollBackOrder = 'rollBackOrder',
    resetValueCacheWhenUpdateProductFail = 'resetValueCacheWhenUpdateProductFail',
    createCronJobToUpdateProduct = 'createCronJobToUpdateProduct',
    resetValueVoucherWHenUpdateProductFail = 'resetValueVOucherWhenUpdateProductFail',
    createCronJobVoucherToUpdateQuanttiy = 'createCronJobVoucherToUpdateQuantity'
}

export enum BackgroundName {
    mail = 'sendMail',
    product = 'product',
    order = 'order',
    voucher = 'voucher'
}
