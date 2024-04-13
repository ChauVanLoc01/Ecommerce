import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'react-toastify'
import { PurchaseFetching } from 'src/Api/PurchaseFetching'
import { Order } from 'src/types/Purchase.type'

function useAddToCartMutation() {
  const clientQuery = useQueryClient()
  const addToCartMutation = useMutation({
    mutationFn: (body: Order) => PurchaseFetching.AddToCardFetching(body),
    onSuccess: (data) => {
      clientQuery.invalidateQueries({
        queryKey: ['purchases', -1]
      })
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    },
    onError(error, variables, context) {
      toast.error('Lỗi!', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    }
  })
  return addToCartMutation
}

export default useAddToCartMutation
