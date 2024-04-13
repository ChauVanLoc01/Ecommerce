import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { PurchaseFetching } from 'src/Api/PurchaseFetching'
import { PurchaseStatus } from 'src/constants/PurchaseStatus'

function useQueryListPurchase(isAuth: boolean, status?: number) {
  const purchaseFetching = useQuery({
    queryKey: ['purchases', status || -1],
    queryFn: () =>
      PurchaseFetching.GetPurchasesFetching(status || PurchaseStatus.IN_CART),
    enabled: isAuth
  })
  return purchaseFetching
}

export default useQueryListPurchase
