const CustomerInformation = () => {
    return (
        <div className='space-y-3'>
            <h2 className='text-sm font-semibold'>Customer Information</h2>
            <section className='text-[12px] basis-1/3 py-3 pl-3 pr-20 rounded-[3.5px] border border-gray-200'>
                <section className='space-y-2'>
                    <div>
                        <span>Name</span>
                        <h5 className='font-semibold'>Mick Jeson Holder</h5>
                    </div>
                    <div>
                        <span>Email</span>
                        <h5 className='font-semibold'>Mick Jeson Holder</h5>
                    </div>
                    <div>
                        <span>Shipping Address</span>
                        <h5 className='font-semibold'>Mỹ Tho, Tiền Giang</h5>
                    </div>
                </section>
            </section>
        </div>
    )
}

export default CustomerInformation
