import { Grid } from '@radix-ui/themes'
import { Product } from 'src/types/product.type'
import ProductCard from '../ProductList/ProductCard'

type NewProps = {
    products: Product[]
}

const New = ({ products }: NewProps) => {
    return (
        <Grid columns={'4'} gap={'5'}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} isHiddenStore />
            ))}
        </Grid>
    )
}

export default New
