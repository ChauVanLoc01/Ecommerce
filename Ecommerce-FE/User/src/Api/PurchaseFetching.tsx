import { ListPurchase, Order, Purchase } from 'src/types/Purchase.type'
import http from './http'
import { PathRoute } from 'src/constants/PathRoute'
import { PurchaseStatus } from '../constants/PurchaseStatus'
import { ResponveApi } from 'src/types/Responve.type'

const { purchase, addToCard, updatePurchase, buyPurchase } = PathRoute

export const PurchaseFetching = {
  AddToCardFetching: (body: Order) => {
    return http.post<ResponveApi<Purchase>>(`${purchase}/${addToCard}`, body)
  },
  GetPurchasesFetching: (status: PurchaseStatus) => {
    return http.get<ResponveApi<ListPurchase>>(`${purchase}?status=${status}`)
  },
  UpdatePurchaseFetching: (body: Order) => {
    return http.put<ResponveApi<Purchase>>(
      `${purchase}/${updatePurchase}`,
      body
    )
  },
  DeletePurchaseFetching: (id: string[]) => {
    return http.delete<ResponveApi<{ deleted_count: number }>>(`${purchase}`, {
      data: id
    })
  },
  BuyPurchaseFetching: (body: Order[]) => {
    return http.post<ResponveApi<Order[]>>(`/${purchase}/${buyPurchase}`, body)
  }
}
