import { useState } from 'react'
import { endProductDetailFetching, startProductDetailFetching } from 'src/constants/event'

const useLoadingProduct = (productId: string) => {
    const [isFetching, setIsFetching] = useState<boolean>(false)

    window.addEventListener(startProductDetailFetching, (e: any) => {
        if (e.detail.productDetail === productId) {
            setIsFetching(true)
        }
    })

    window.addEventListener(endProductDetailFetching, (e: any) => {
        if (e.detail.productDetail === productId) {
            setIsFetching(false)
        }
    })

    return [isFetching, setIsFetching]
}

export default useLoadingProduct
