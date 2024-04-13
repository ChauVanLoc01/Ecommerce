import classNames from 'classnames'
import useQueryParams from 'src/hooks/useQueryParams'
import { ProductListQuery } from 'src/types/product.type'

interface Props {
    pageSize: number
}

const RANGE = 3
export default function Pagination({ pageSize }: Props) {
    const [queryParams, setQueryParams] = useQueryParams<Partial<Record<keyof ProductListQuery, string>>>()

    const page = Number(queryParams?.page) || 1

    const handleRedirectPage = (pageNumber: number) => () => {
        setQueryParams({ ...queryParams, page: pageNumber } as any)
    }

    const renderPagination = () => {
        let dotAfter = false
        let dotBefore = false
        const renderDotBefore = (index: number) => {
            if (!dotBefore) {
                dotBefore = true
                return (
                    <span key={index} className='mx-2 rounded border bg-[#FFFFFF] px-3 py-2 shadow-sm border-border/30'>
                        ...
                    </span>
                )
            }
            return null
        }
        const renderDotAfter = (index: number) => {
            if (!dotAfter) {
                dotAfter = true
                return (
                    <span key={index} className='mx-2 rounded border border-border/30 bg-[#FFFFFF] px-3 py-2 shadow-sm'>
                        ...
                    </span>
                )
            }
            return null
        }
        return Array(pageSize)
            .fill(0)
            .map((_, index) => {
                const pageNumber = index + 1

                // Điều kiện để return về ...
                if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
                    return renderDotAfter(index)
                } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
                    if (pageNumber < page - RANGE && pageNumber > RANGE) {
                        return renderDotBefore(index)
                    } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
                        return renderDotAfter(index)
                    }
                } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
                    return renderDotBefore(index)
                }

                return (
                    <button
                        onClick={handleRedirectPage(pageNumber)}
                        key={index}
                        className={classNames('mx-2 cursor-pointer rounded border px-3 py-2 shadow-sm', {
                            'border-none bg-blue-600 text-white': pageNumber === page,
                            'border-border/30 bg-[#FFFFFF]': pageNumber !== page
                        })}
                    >
                        {pageNumber}
                    </button>
                )
            })
    }
    return (
        <div className='mt-6 flex flex-wrap justify-end'>
            {page === 1 ? (
                <span className='mx-2 cursor-not-allowed rounded border bg-[#FFFFFF]/60 px-3 py-2  shadow-sm'>
                    Prev
                </span>
            ) : (
                <button
                    className='mx-2 cursor-pointer rounded border bg-[#FFFFFF] px-3 py-2  shadow-sm'
                    onClick={() => setQueryParams({ ...queryParams, page: Number(queryParams?.page) - 1 } as any)}
                >
                    Prev
                </button>
            )}

            {renderPagination()}
            {page === pageSize ? (
                <span className='mx-2 cursor-not-allowed rounded border bg-[#FFFFFF]/60 px-3 py-2  shadow-sm'>
                    Next
                </span>
            ) : (
                <button
                    className='mx-2 cursor-pointer rounded border bg-[#FFFFFF] px-3 py-2  shadow-sm'
                    onClick={() => setQueryParams({ ...queryParams, page: Number(queryParams?.page || 1) + 1 } as any)}
                >
                    Next
                </button>
            )}
        </div>
    )
}
