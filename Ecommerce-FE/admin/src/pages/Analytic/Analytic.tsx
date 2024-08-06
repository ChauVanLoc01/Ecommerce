import { Grid } from '@radix-ui/themes'
import SimpleBar from 'simplebar-react'
import CustomerStatistic from './BarAnalytic/CustomerStatistic'
import OrderStatistic from './BarAnalytic/OrderStatistic'
import ProductStatistic from './BarAnalytic/ProductStatistic'
import TakingStatistic from './BarAnalytic/TakingStatistic'
import Top10Product from './BarAnalytic/Top10Product'
import ProductRate from './PieAnalytic/ProductRate'

const Analytic = () => {
    return (
        <div className='space-y-5'>
            <SimpleBar style={{ maxHeight: '1200px' }}>
                <Grid columns={'2'} gap={'5'}>
                    <TakingStatistic />
                    <OrderStatistic />
                    <ProductStatistic />
                    <CustomerStatistic />
                    <Top10Product />
                    <ProductRate />
                    {/* <ProductView /> */}
                </Grid>
            </SimpleBar>
        </div>
    )
}

export default Analytic
