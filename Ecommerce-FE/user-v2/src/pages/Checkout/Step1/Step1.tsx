import SimpleBar from 'simplebar-react'

import { useState } from 'react'
import CartItem from './CartItem'

import { Reorder } from 'framer-motion'
import { ProductContextExtends } from 'src/types/context.type'

type Step1Props = {
    products: { [storeId: string]: ProductContextExtends[] }
    storeIds: string[]
}

const Step1 = ({ products, storeIds }: Step1Props) => {
    const [stores, setStores] = useState<string[]>(storeIds)

    return (
        <SimpleBar style={{ maxHeight: 680, paddingRight: 10, paddingBottom: 15 }}>
            <Reorder.Group as='ul' axis='y' values={stores} onReorder={setStores} className='space-y-4'>
                {Object.keys(products).map((storeId) => (
                    <Reorder.Item key={storeId} value={storeId}>
                        <CartItem key={storeId} storeId={storeId} />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </SimpleBar>
    )
}

export default Step1
