import SimpleBar from 'simplebar-react'

import { useState } from 'react'
import CartItem from './CartItem'

import { Reorder } from 'framer-motion'
import { ProductConvert } from 'src/types/context.type'
import { RefreshStore } from 'src/types/store.type'

type Step1Props = {
    all: ProductConvert
    checked: ProductConvert
    storesLatest: RefreshStore
    storeIds: string[]
}

const Step1 = ({ all, checked, storeIds, storesLatest }: Step1Props) => {
    const [stores, setStores] = useState<string[]>(storeIds)

    return (
        <SimpleBar style={{ maxHeight: 680, paddingRight: 10, paddingBottom: 15 }}>
            <Reorder.Group as='ul' axis='y' values={stores} onReorder={setStores} className='space-y-4'>
                {storeIds.map((storeId) => (
                    <Reorder.Item key={storeId} value={storeId}>
                        <CartItem
                            key={storeId}
                            productIds={Object.keys(all[storeId])}
                            isCheckedAll={
                                checked[storeId]
                                    ? Object.values(all[storeId]).length === Object.values(checked[storeId]).length
                                    : false
                            }
                            products={all[storeId]}
                            store={storesLatest[storeId]}
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </SimpleBar>
    )
}

export default Step1
