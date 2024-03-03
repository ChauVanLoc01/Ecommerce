import SimpleBar from 'simplebar-react'

import CartItem from './CartItem'

const Step1 = () => {
    return (
        <SimpleBar style={{ maxHeight: 580, paddingRight: 10 }}>
            <section className='space-y-4'>
                <CartItem />
                <CartItem />
                <CartItem />
                <CartItem />
                <CartItem />
                <CartItem />
            </section>
        </SimpleBar>
    )
}

export default Step1
