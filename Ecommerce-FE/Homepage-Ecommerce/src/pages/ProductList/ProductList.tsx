import Pagination from 'src/components/Pagination'
import { useMemo } from 'react'
import { ProductSearch } from 'src/constants/KeySearch'
import useQueryListProduct from 'src/hooks/useQueryListProduct'
import useSearchUrl from 'src/hooks/useSearchUrl'
import { joinKeySearch } from 'src/utils/utils'
import Aside from './Aside'
import Product from './Product/Product'
import Sort from './Sort'
import Empty from 'antd/lib/empty'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { ProductFetching } from 'src/Api/ProductFetching'
import { Helmet } from 'react-helmet-async'

const limit = 10

function ProductList() {
  const o = useSearchUrl(limit)
  const getListProduct = useQueryListProduct(o)
  const getListCategory = useQuery({
    queryKey: ['category'],
    queryFn: () => ProductFetching.ListCategoryFetching(),
    staleTime: Infinity
  })
  const ListCateGoryData = getListCategory.data?.data.data
  const ListProductdata = getListProduct.data?.data.data.products
  if (!ListCateGoryData && !ListProductdata) return null
  return (
    <div id='productid' className='bg-[#F5f5f5] py-2 md:px-3 lg:py-2 xl:py-4'>
      <Helmet>
        <title>Trang chủ TechShop</title>
        <meta name='description' content='Trang chủ TechShop' />
      </Helmet>
      <div className='flex flex-col bg-[#F5f5f5] md:mx-auto md:max-w-3xl md:flex-row lg:mx-auto lg:max-w-4xl lg:flex-row xl:mx-auto xl:max-w-7xl xl:flex-row'>
        <div className='md:mr-6 md:w-[20%] lg:mr-6 lg:w-[20%] xl:mr-6 xl:w-[20%]'>
          {ListCateGoryData && (
            <Aside
              joinKeySearch={joinKeySearch<ProductSearch>(o)}
              ObjectKeySearch={o}
              categories={ListCateGoryData}
            />
          )}
          <div className='px-2 md:px-0 lg:px-0 xl:px-0'>
            <Sort
              rootClassname='flex md:hidden lg:hidden xl:hidden'
              SearchParamsObject={o}
              page={o.page as number}
              stringPagination={joinKeySearch(o)}
              pageSize={
                getListProduct.data?.data.data.pagination.page_size as number
              }
            />
          </div>
        </div>
        <div className='flex flex-col md:w-[80%] lg:w-[80%] xl:w-[80%]'>
          <Sort
            rootClassname='hidden md:flex lg:flex xl:flex'
            SearchParamsObject={o}
            page={o.page as number}
            stringPagination={joinKeySearch(o)}
            pageSize={
              getListProduct.data?.data.data.pagination.page_size as number
            }
          />
          {!getListProduct.data ? (
            <Empty />
          ) : (
            <div
              className={classNames({
                'flex h-[500px] w-[992px] items-center justify-center':
                  ListProductdata?.length === 0,
                'grid grid-cols-2 gap-2 p-2 phone:gap-2 phone:px-2 md:grid-cols-3 md:gap-3 md:p-0 lg:grid-cols-4 lg:gap-4 lg:p-0 xl:grid-cols-5 xl:gap-4 xl:p-0':
                  ListProductdata && ListProductdata?.length > 0
              })}
            >
              {ListProductdata?.map((e) => (
                <Product
                  product={e}
                  key={e._id}
                  rating={e.rating}
                  classNameBlock='lg:hover:translate-y-[-3px] xl:hover:translate-y-[-3px] ease-in-out duration-[0.2s] rounded-sm shadow-md bg-product'
                />
              ))}
              {ListProductdata?.length === 0 && (
                <Empty
                  description={
                    <span className='text-lg font-medium'>
                      Không tìm thấy sản phẩm nào phù hợp
                    </span>
                  }
                  imageStyle={{ width: 300, height: 300 }}
                />
              )}
            </div>
          )}
          <Pagination
            page={o.page as number}
            stringPagination={joinKeySearch<ProductSearch>(o)}
            pageSize={
              getListProduct.data?.data.data.pagination.page_size as number
            }
          />
        </div>
      </div>
    </div>
  )
}

export default ProductList
