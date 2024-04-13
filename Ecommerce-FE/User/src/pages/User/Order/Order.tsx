import Empty from 'antd/lib/empty'
import classNames from 'classnames'
import debounce from 'lodash/debounce'
import { useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { PathRoute } from 'src/constants/PathRoute'
import { PurchaseStatus } from 'src/constants/PurchaseStatus'
import { Context } from 'src/context/AppContext'
import useAddToCartMutation from 'src/hooks/useAddToCartMutation'
import useQueryListPurchase from 'src/hooks/useQueryListPurchase'
import { ListPurchase } from 'src/types/Purchase.type'
import { convertCurrentcy, initId } from 'src/utils/utils'

function Order() {
  const [searchParams] = useSearchParams()
  const { status } = Object.fromEntries([...searchParams])
  const { isAuth } = useContext(Context)
  const [purchase, setPurchase] = useState<ListPurchase>([])
  const addToCartMutation = useAddToCartMutation()
  const navigate = useNavigate()
  const purchaseFetching = useQueryListPurchase(
    isAuth,
    Number(status || PurchaseStatus.WAITING_FOR_SHOP)
  )
  const handleOrder = (id: string) => async () => {
    const purchase = await addToCartMutation.mutateAsync({
      product_id: id,
      buy_count: 1
    })
    navigate(`/${PathRoute.cart}`, {
      state: {
        id: purchase.data.data._id
      }
    })
  }
  const handleSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchase(purchaseFetching.data?.data.data as ListPurchase)
    const { value } = e.target
    value &&
      setPurchase((pre) =>
        pre.filter(
          (p) =>
            p._id.toUpperCase().includes(value.toUpperCase()) ||
            p.product._id.toUpperCase().includes(value.toUpperCase()) ||
            p.product.name.toUpperCase().includes(value.toUpperCase())
        )
      )
    !value && setPurchase(purchaseFetching.data?.data.data as ListPurchase)
  }, 1200)
  useEffect(() => {
    purchaseFetching.data && setPurchase(purchaseFetching.data?.data.data)
  }, [purchaseFetching.isSuccess, purchaseFetching.isRefetching])
  return (
    <div className='bg-backg md:max-w-3xl md:px-0 lg:max-w-4xl xl:max-w-7xl xl:text-sm'>
      <Helmet>
        <title>Đơn hàng</title>
        <meta
          name='description'
          content='Danh sách các trạng thái đơn hàng của khác hàng'
        />
      </Helmet>
      <div className='sticky top-0 mb-3 flex items-center rounded-sm bg-product shadow-sm md:mb-4'>
        <NavLink
          to={{ search: `status=${PurchaseStatus.WAITING_FOR_SHOP}` }}
          className={`px-8 py-3 text-center md:w-[20%] md:px-2 xl:py-5 ${classNames(
            {
              'border-b-2 border-b-primary text-primary':
                Number(status) === PurchaseStatus.WAITING_FOR_SHOP || !status,
              'relative after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-0 after:bg-primary hover:text-primary hover:after:transition-all hover:after:duration-500 hover:after:ease-in-out lg:hover:after:w-full':
                status !== undefined &&
                Number(status) !== PurchaseStatus.WAITING_FOR_SHOP
            }
          )}`}
        >
          Tất cả
        </NavLink>
        <NavLink
          to={{ search: `status=${PurchaseStatus.PICK_UP}` }}
          className={`hidden px-8 py-3 text-center lg:block lg:w-[20%] lg:px-3 xl:py-5 ${classNames(
            {
              'border-b-2 border-b-primary text-primary':
                Number(status) === PurchaseStatus.PICK_UP,
              'relative after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-0 after:bg-primary hover:text-primary hover:after:transition-all hover:after:duration-500 hover:after:ease-in-out lg:hover:after:w-full':
                Number(status) !== PurchaseStatus.PICK_UP
            }
          )}`}
        >
          Chờ xác nhận
        </NavLink>
        <NavLink
          to={{ search: `status=${PurchaseStatus.SHIP}` }}
          className={`px-8 py-3 text-center lg:w-[20%] lg:px-3 xl:py-5 ${classNames(
            {
              'border-b-2 border-b-primary text-primary':
                Number(status) === PurchaseStatus.SHIP,
              'relative after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-0 after:bg-primary hover:text-primary hover:after:transition-all hover:after:duration-500 hover:after:ease-in-out lg:hover:after:w-full':
                Number(status) !== PurchaseStatus.SHIP
            }
          )}`}
        >
          Đã giao
        </NavLink>
        <NavLink
          to={{ search: `status=${PurchaseStatus.DELIVERY}` }}
          className={`px-8 py-3 text-center lg:w-[20%] lg:px-3 xl:py-5 ${classNames(
            {
              'border-b-2 border-b-primary text-primary':
                Number(status) === PurchaseStatus.DELIVERY,
              'relative after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-0 after:bg-primary hover:text-primary hover:after:transition-all hover:after:duration-500 hover:after:ease-in-out lg:hover:after:w-full':
                Number(status) !== PurchaseStatus.DELIVERY
            }
          )}`}
        >
          Đang giao
        </NavLink>
        <NavLink
          to={{ search: `status=${PurchaseStatus.CANCEL}` }}
          className={`px-8 py-3 text-center lg:w-[20%] lg:px-3 xl:py-5 ${classNames(
            {
              'border-b-2 border-b-primary text-primary':
                Number(status) === PurchaseStatus.CANCEL,
              'relative after:absolute after:bottom-[-1px] after:left-0 after:h-[2px] after:w-0 after:bg-primary hover:text-primary hover:after:transition-all hover:after:duration-500 hover:after:ease-in-out lg:hover:after:w-full':
                Number(status) !== PurchaseStatus.CANCEL
            }
          )}`}
        >
          Đã hủy
        </NavLink>
      </div>
      {purchase.length > 0 && (
        <div className='flex items-center rounded-sm bg-[#EAEAEA]/70 px-2 py-2 shadow-sm md:px-4 md:py-2'>
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='mr-2 h-4 w-4 text-gray-300 md:mr-4 md:h-6 md:w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'
              />
            </svg>
          </span>
          <input
            className='grow bg-[#EAEAEA]/70 outline-none placeholder:italic'
            onChange={handleSearch}
            type='text'
            placeholder='Bạn có thể tìm kiếm theo ID đơn hàng, tên sản phẩm, ID sản phẩm'
          />
        </div>
      )}
      <div className={`rounded-sm bg-backg shadow-sm`}>
        {purchase.length > 0 ? (
          purchase.map((p) => (
            <div
              key={p._id}
              className='mt-3 rounded-sm bg-product p-2 shadow-sm md:mt-4 md:p-4 lg:p-6'
            >
              <div className='flex items-center justify-end border-b-[1px] border-b-gray-200 pb-2 md:pb-4'>
                <span className='mr-2 flex text-green-600 phone:mr-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='mr-3 h-4 w-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'
                    />
                  </svg>
                  Đơn hàng đã được giao thành công
                </span>
                <span className='border-l-2 border-l-gray-300 pl-[10px] uppercase text-primary phone:pl-5'>
                  Hoàn thành
                </span>
              </div>
              <NavLink
                to={`/${initId(p.product.name)}-id,${p.product._id}`}
                className='flex cursor-pointer py-3 md:scroll-px-0 md:py-4'
              >
                <div className='basis-1/8'>
                  <img
                    className='max-w-[70px] md:max-w-[80px]'
                    src={p.product.image}
                    alt=''
                  />
                </div>
                <div className='basis-7/8 pl-2 phone:pl-3 md:basis-5/8 md:px-3 lg:px-4 xl:px-0 xl:pr-5'>
                  <p className='mb-2 line-clamp-2 md:mb-3'>{p.product.name}</p>
                  <div className='block md:hidden'>
                    <span className='mr-3 text-gray-300 line-through'>
                      ₫{convertCurrentcy(p.price_before_discount, 0)}
                    </span>
                    <span className='text-primary'>
                      ₫{convertCurrentcy(p.price, 0)}
                    </span>
                  </div>
                  <span>x{p.buy_count}</span>
                </div>
                <div className='hidden flex-wrap-reverse items-center justify-end text-sm md:flex md:basis-2/8'>
                  <span className='ml-3 text-gray-300 line-through lg:ml-0 lg:mr-3'>
                    ₫{convertCurrentcy(p.price_before_discount, 0)}
                  </span>
                  <span className='text-primary'>
                    ₫{convertCurrentcy(p.price, 0)}
                  </span>
                </div>
              </NavLink>
              <div className='border-t-[1px] border-gray-200'>
                <div className='mt-2 flex items-center justify-end md:mt-4'>
                  <span>
                    <svg
                      width={16}
                      height={17}
                      viewBox='0 0 253 263'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M126.5 0.389801C126.5 0.389801 82.61 27.8998 5.75 26.8598C5.08763 26.8507 4.43006 26.9733 3.81548 27.2205C3.20091 27.4677 2.64159 27.8346 2.17 28.2998C1.69998 28.7657 1.32713 29.3203 1.07307 29.9314C0.819019 30.5425 0.688805 31.198 0.689995 31.8598V106.97C0.687073 131.07 6.77532 154.78 18.3892 175.898C30.003 197.015 46.7657 214.855 67.12 227.76L118.47 260.28C120.872 261.802 123.657 262.61 126.5 262.61C129.343 262.61 132.128 261.802 134.53 260.28L185.88 227.73C206.234 214.825 222.997 196.985 234.611 175.868C246.225 154.75 252.313 131.04 252.31 106.94V31.8598C252.31 31.1973 252.178 30.5414 251.922 29.9303C251.667 29.3191 251.292 28.7649 250.82 28.2998C250.35 27.8358 249.792 27.4696 249.179 27.2225C248.566 26.9753 247.911 26.852 247.25 26.8598C170.39 27.8998 126.5 0.389801 126.5 0.389801Z'
                        fill='#ee4d2d'
                      />
                      <path
                        fillRule='evenodd'
                        clipRule='evenodd'
                        d='M207.7 149.66L119.61 107.03C116.386 105.472 113.914 102.697 112.736 99.3154C111.558 95.9342 111.772 92.2235 113.33 88.9998C114.888 85.7761 117.663 83.3034 121.044 82.1257C124.426 80.948 128.136 81.1617 131.36 82.7198L215.43 123.38C215.7 120.38 215.85 117.38 215.85 114.31V61.0298C215.848 60.5592 215.753 60.0936 215.57 59.6598C215.393 59.2232 215.128 58.8281 214.79 58.4998C214.457 58.1705 214.063 57.909 213.63 57.7298C213.194 57.5576 212.729 57.4727 212.26 57.4798C157.69 58.2298 126.5 38.6798 126.5 38.6798C126.5 38.6798 95.31 58.2298 40.71 57.4798C40.2401 57.4732 39.7735 57.5602 39.3376 57.7357C38.9017 57.9113 38.5051 58.1719 38.1709 58.5023C37.8367 58.8328 37.5717 59.2264 37.3913 59.6604C37.2108 60.0943 37.1186 60.5599 37.12 61.0298V108.03L118.84 147.57C121.591 148.902 123.808 151.128 125.129 153.884C126.45 156.64 126.797 159.762 126.113 162.741C125.429 165.72 123.755 168.378 121.363 170.282C118.972 172.185 116.006 173.221 112.95 173.22C110.919 173.221 108.915 172.76 107.09 171.87L40.24 139.48C46.6407 164.573 62.3785 186.277 84.24 200.16L124.49 225.7C125.061 226.053 125.719 226.24 126.39 226.24C127.061 226.24 127.719 226.053 128.29 225.7L168.57 200.16C187.187 188.399 201.464 170.892 209.24 150.29C208.715 150.11 208.2 149.9 207.7 149.66Z'
                        fill='#fff'
                      />
                    </svg>
                  </span>
                  <span className='ml-2 mr-4'>Thành tiền:</span>
                  <span className='text-lg text-primary lg:text-xl xl:text-2xl'>
                    ₫{convertCurrentcy(p.buy_count * p.price, 0)}
                  </span>
                </div>
                <div className='mt-2 flex flex-row-reverse items-center justify-evenly md:mt-4 md:flex-row md:justify-end'>
                  <button
                    onClick={handleOrder(p.product._id)}
                    className='rounded-md bg-primary px-4 py-2 capitalize text-white hover:bg-primary/90 phone:px-3 md:mr-4 md:py-2 md:px-5 lg:px-7 lg:py-3'
                  >
                    Mua Lại
                  </button>
                  <button className='rounded-md border-[1px] border-gray-300 px-2 py-2 capitalize phone:px-3 md:mr-4 md:py-2 md:px-5 lg:px-7 lg:py-3'>
                    Liên hệ người bán
                  </button>
                  <button className='rounded-md border-[1px] border-gray-300 px-2 py-2 capitalize phone:px-3 md:py-2 md:px-5 lg:px-7 lg:py-3'>
                    Xem đánh giá Shop
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='flex h-[450px] items-center justify-center bg-product md:h-[350px] lg:mt-4 lg:h-[400px]'>
            <Empty
              image='https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/5fafbb923393b712b96488590b8f781f.png'
              imageStyle={{
                width: '140px',
                height: '140px',
                margin: '17px auto'
              }}
              description={
                <span className='text-lg font-medium'>
                  Chưa có đơn hàng nào
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Order
