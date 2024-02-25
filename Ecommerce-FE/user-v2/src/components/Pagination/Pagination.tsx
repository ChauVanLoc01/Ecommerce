import classNames from 'classnames'
import { Link } from 'react-router-dom'

interface Props {
    pageSize: number
}

const RANGE = 2
export default function Pagination({ pageSize }: Props) {
    const page = 1

    const renderPagination = () => {
        let dotAfter = false
        let dotBefore = false
        const renderDotBefore = (index: number) => {
            if (!dotBefore) {
                dotBefore = true
                return (
                    <span
                        key={index}
                        className='mx-2 rounded border bg-[#FFFFFF] px-3 py-2 shadow-sm border-border/30'
                    >
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
                    <span
                        key={index}
                        className='mx-2 rounded border border-border/30 bg-[#FFFFFF] px-3 py-2 shadow-sm'
                    >
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
                if (
                    page <= RANGE * 2 + 1 &&
                    pageNumber > page + RANGE &&
                    pageNumber < pageSize - RANGE + 1
                ) {
                    return renderDotAfter(index)
                } else if (
                    page > RANGE * 2 + 1 &&
                    page < pageSize - RANGE * 2
                ) {
                    if (pageNumber < page - RANGE && pageNumber > RANGE) {
                        return renderDotBefore(index)
                    } else if (
                        pageNumber > page + RANGE &&
                        pageNumber < pageSize - RANGE + 1
                    ) {
                        return renderDotAfter(index)
                    }
                } else if (
                    page >= pageSize - RANGE * 2 &&
                    pageNumber > RANGE &&
                    pageNumber < page - RANGE
                ) {
                    return renderDotBefore(index)
                }

                return (
                    <Link
                        to={'/'}
                        key={index}
                        className={classNames(
                            'mx-2 cursor-pointer rounded border px-3 py-2 shadow-sm',
                            {
                                'border-none bg-blue-600 text-white':
                                    pageNumber === page,
                                'border-border/30 bg-[#FFFFFF]':
                                    pageNumber !== page
                            }
                        )}
                    >
                        {pageNumber}
                    </Link>
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
                <Link
                    to={'/'}
                    className='mx-2 cursor-pointer rounded border bg-[#FFFFFF] px-3 py-2  shadow-sm'
                >
                    Prev
                </Link>
            )}

            {renderPagination()}
            {page === pageSize ? (
                <span className='mx-2 cursor-not-allowed rounded border bg-[#FFFFFF]/60 px-3 py-2  shadow-sm'>
                    Next
                </span>
            ) : (
                <Link
                    to={'/'}
                    className='mx-2 cursor-pointer rounded border bg-[#FFFFFF] px-3 py-2  shadow-sm'
                >
                    Next
                </Link>
            )}
        </div>
    )
}
