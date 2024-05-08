import { useState } from 'react'
import { loadingFetchingEvent } from 'src/constants/event.constants'

const useLoadingFetching = () => {
    const [loadingFetching, setLoadingFetching] = useState<boolean>(false)

    window.addEventListener(loadingFetchingEvent.start, () => {
        setLoadingFetching(true)
    })

    window.addEventListener(loadingFetchingEvent.end, () => {
        setLoadingFetching(false)
    })

    return [loadingFetching, setLoadingFetching]
}

export default useLoadingFetching
