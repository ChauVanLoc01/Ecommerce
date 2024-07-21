import { Grid } from '@radix-ui/themes'
import CustomerStatistic from '../Analytic/BarAnalytic/CustomerStatistic'
import OrderStatistic from '../Analytic/BarAnalytic/OrderStatistic'
import ProductStatistic from '../Analytic/BarAnalytic/ProductStatistic'
import TakingStatistic from '../Analytic/BarAnalytic/TakingStatistic'
import Top10Product from '../Analytic/BarAnalytic/Top10Product'
import ProductView from '../Analytic/LineAnalytic/ProductView'
import ProductRate from '../Analytic/PieAnalytic/ProductRate'

const Overview = () => {
    return (
        <div className='space-y-5'>
            <Grid columns={'4'} gap={'5'}>
                {/* <TakingStatistic /> */}
                <OrderStatistic />
                <ProductStatistic />
                <CustomerStatistic />
            </Grid>
            <Grid columns={'3'} gapX={'5'}>
                <Top10Product />
                <ProductRate />
                <ProductView />
            </Grid>
        </div>
    )
}

export default Overview
