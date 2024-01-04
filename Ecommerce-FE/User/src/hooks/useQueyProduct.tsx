import { useQuery } from '@tanstack/react-query'
import { ProductFetching } from 'src/Api/ProductFetching'

function useQueyProduct(idProduct: string) {
  const getProduct = useQuery({
    queryKey: ['Product', idProduct],
    queryFn: () => ProductFetching.ProductFetching(idProduct)
  })
  return getProduct
}

export default useQueyProduct
