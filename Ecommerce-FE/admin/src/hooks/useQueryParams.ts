import { SetURLSearchParams, useSearchParams } from 'react-router-dom'

const useQueryParams: <T>() => [T, SetURLSearchParams] = <T>() => {
    const [searchParams, setQueryParams] = useSearchParams()

    return [Object.fromEntries(searchParams) as T, setQueryParams]
}

export default useQueryParams
