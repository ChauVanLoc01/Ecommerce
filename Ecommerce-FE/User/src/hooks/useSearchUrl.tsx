import { useMemo } from 'react'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import { useSearchParams } from 'react-router-dom'
import { OrderType, ProductSearch, SortType } from 'src/constants/KeySearch'

function useSearchUrl(limitValue: number = 0): ProductSearch {
  const [searchParams] = useSearchParams()
  const {
    page,
    limit,
    category,
    order,
    sort_by,
    exclude,
    name,
    price_max,
    price_min,
    rating_filter
  } = Object.fromEntries([...searchParams])
  return useMemo(
    () =>
      omitBy(
        {
          page: Number(page || 1),
          limit: limitValue === 0 ? undefined : limitValue,
          category: category ? category : undefined,
          order:
            order !== undefined
              ? [String(OrderType.asc), String(OrderType.desc)].includes(order)
                ? (order as keyof typeof OrderType)
                : undefined
              : undefined,
          sort_by:
            sort_by !== undefined
              ? [
                  String(SortType.price),
                  String(SortType.sold),
                  String(SortType.view),
                  ,
                  String(SortType.createdAt)
                ].includes(sort_by)
                ? (sort_by as keyof typeof SortType)
                : undefined
              : undefined,
          exclude: exclude ? exclude : undefined,
          name: name ? name : undefined,
          price_max: price_max ? Number(price_max) : undefined,
          price_min: price_min ? Number(price_min) : undefined,
          rating_filter: rating_filter ? Number(rating_filter) : undefined
        },
        isUndefined
      ),
    [
      page,
      limit,
      category,
      order,
      sort_by,
      exclude,
      name,
      price_max,
      price_min,
      rating_filter
    ]
  )
}

export default useSearchUrl
