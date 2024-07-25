import { Product } from 'src/types/product.type'
import FlashSale from '../ProductList/FlashSale'

type HomeProps = {
    programs: Product[]
}

const Home = ({ programs }: HomeProps) => {
    return (
        <div>
            <FlashSale isHiddenMore />
        </div>
    )
}

export default Home
