import { http } from './http'

export const sale_api = {
    current_sale_promotin: () => {
        return http.get('/store/sale-promotion/current-sale')
    }
}
