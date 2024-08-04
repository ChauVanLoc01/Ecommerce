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
    createCronJobVoucherToUpdateQuanttiy = 'createCronJobVoucherToUpdateQuantity',
    rollbackAddingProductToSale = 'rollbackAddingProductToSale',
    rollbackUpdatingProductToSale = 'rollbackUpdatingProductToSale',
    createCronJobToUpdateProductSale = 'createCronJobToUpdateProductSale'
}

export enum BackgroundName {
    mail = 'sendMail',
    product = 'product',
    order = 'order',
    voucher = 'voucher',
    product_sale = 'product_sale'
}
