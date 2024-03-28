import SimpleBar from 'simplebar-react'

import { useContext } from 'react'
import { toast } from 'sonner'
import { AppContext } from 'src/contexts/AppContext'
import CartItem from './CartItem'

import { Reorder } from 'framer-motion'

const Step1 = () => {
    const { products, setProducts } = useContext(AppContext)

    const handleDeleteProduct = (id: string) => () => {
        toast.info('Xóa sản phẩm thành công')
        setProducts(products.filter((product) => product.id !== id))
    }

    const handleChangeQuantity = (id: string, quantity: number) => {
        console.log('quantity', quantity);
        const new_products = products.map((product) => {
            if (product.id === id) {
                product.buy = quantity
            }
            return product
        })
        setProducts([...new_products])
    }

    const handleChecked = (id: string, checked: boolean) => {
        const new_products = products.map((product) => {
            if (product.id === id) {
                product.checked = checked
            }
            return product
        })
        setProducts([...new_products])
    }

    return (
        <SimpleBar style={{ maxHeight: 580, paddingRight: 10 }}>
            <Reorder.Group as='ul' axis='y' values={products} onReorder={setProducts} className='space-y-4'>
                {products.map((product) => (
                    <Reorder.Item key={product.id} value={product}>
                        <CartItem
                            key={product.id}
                            product={product}
                            handleDeleteProduct={handleDeleteProduct}
                            handleChangeQuantity={handleChangeQuantity}
                            handleChecked={handleChecked}
                        />
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </SimpleBar>
    )
}

export default Step1
