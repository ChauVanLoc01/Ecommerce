import { Heading, Text } from '@radix-ui/themes'
import ProductTable from './ProductTable'

const Product = () => {
    return (
        <div className='bg-white rounded-8 border-border/30 p-24'>
            <Text>5/10 Nhân viên</Text>
            <ProductTable />
        </div>
    )
}

export default Product
