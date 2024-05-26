import SimpleBar from 'simplebar-react'

import { useContext, useState } from 'react'
import { AppContext } from 'src/contexts/AppContext'
import CartItem from './CartItem'

import { Reorder } from 'framer-motion'

const Step1 = () => {
    const { products } = useContext(AppContext)
    const [stores, setStores] = useState<string[]>(Object.keys(products.products))

    return (
        <SimpleBar style={{ maxHeight: 680, paddingRight: 10, paddingBottom: 15 }}>
            <Reorder.Group as='ul' axis='y' values={stores} onReorder={setStores} className='space-y-4'>
                {Object.keys(products.products).map((storeId) => (
                    <Reorder.Item key={storeId} value={storeId}>
                        <CartItem key={storeId} storeId={storeId} />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </SimpleBar>
    )
}

export default Step1
