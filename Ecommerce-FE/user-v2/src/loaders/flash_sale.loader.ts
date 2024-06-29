import { LoaderFunction } from 'react-router-dom'
import { sale_api } from 'src/apis/sale_promotion.api'
import { queryClient } from 'src/routes/main.route'
import { loadingEvent } from 'src/utils/utils.ts'

export const flashSaleLoader: LoaderFunction = async ({ params }) => {
    loadingEvent.start()

    const salePromotionId = params?.['salePromotionId']

    if (!salePromotionId) {
        return []
    }

    await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['sale-promotion-ids'],
            queryFn: sale_api.getSalePromotionIds
        }),
        queryClient.fetchQuery({
            queryKey: ['product-of-sale-promotion', salePromotionId],
            queryFn: sale_api.getProductOfSalePromotion(salePromotionId),
            staleTime: 1000 * 60 * 2
        })
    ])

    loadingEvent.end()

    return []
}
