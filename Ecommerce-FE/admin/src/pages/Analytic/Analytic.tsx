import { Grid } from '@radix-ui/themes'
import CustomerStatistic from './CustomerStatistic'
import OrderStatistic from './OrderStatistic'
import ProductStatistic from './ProductStatistic'
import TakingStatistic from './TakingStatistic'

const Analytic = () => {
    return (
        <div>
            <Grid columns={'4'} gap={'5'}>
                <TakingStatistic />
                <OrderStatistic />
                <ProductStatistic />
                <CustomerStatistic />
            </Grid>
        </div>
    )
}

export default Analytic
