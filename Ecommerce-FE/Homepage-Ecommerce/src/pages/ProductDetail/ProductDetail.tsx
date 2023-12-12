import DOMPurify from 'dompurify'
import { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Rate from 'antd/lib/rate'
import useQueyProduct from 'src/hooks/useQueyProduct'
import {
  convertCurrentcy,
  convertDigitalNumber,
  rateSale
} from 'src/utils/utils'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'antd/lib/image'
import useIdHook from 'src/hooks/useIdHook'
import classNames from 'classnames'
import { PathRoute } from 'src/constants/PathRoute'
import InputOrder from 'src/components/InputOrder'
import useAddToCartMutation from 'src/hooks/useAddToCartMutation'
import { Context } from 'src/context/AppContext'
import NotFound from '../NotFound'
import SkeletonProductDetail from 'src/components/SkeletonProductDetail'
import { Helmet } from 'react-helmet-async'
import { convert } from 'html-to-text'

function ProductDetail() {
  const { isAuth } = useContext(Context)
  const { idNameProduct } = useParams()
  const navigate = useNavigate()
  const id = idNameProduct?.split(',')[1]
  if (!id) {
    return <NotFound />
  }
  const idProduct = useIdHook()
  const [slider1, setSlider1] = useState<Slider | null>(null)
  const [slider2, setSlider2] = useState<Slider | null>(null)
  const [change, setChange] = useState<number>(0)
  const [count, setCount] = useState<number>(1)
  const addToCartMutation = useAddToCartMutation()
  const handleAddCart = () => {
    if (!isAuth) {
      navigate(`/${PathRoute.login}`)
      return
    }
    addToCartMutation.mutate({
      product_id: id as string,
      buy_count: count
    })
  }
  const handleOrder = async () => {
    if (!isAuth) {
      navigate(`/${PathRoute.login}`)
      return
    }
    const purchase = await addToCartMutation.mutateAsync({
      product_id: id as string,
      buy_count: count
    })
    purchase &&
      navigate(`/${PathRoute.cart}`, {
        state: {
          id: purchase.data.data._id
        }
      })
  }
  const productDetailFetching = useQueyProduct(id as string)
  const product = productDetailFetching.data?.data.data
  if (productDetailFetching.isError) {
    return <NotFound />
  }
  if (!product) {
    return <SkeletonProductDetail />
  }
  return (
    <div className='overflow-x-hidden bg-[#f5f5f5] p-2 text-xs lg:py-3 xl:py-4 xl:text-sm'>
      <Helmet>
        <title>{product.name}</title>
        <meta
          name='description'
          content={convert(product.description, {
            limits: {
              maxInputLength: 130,
              ellipsis: '...'
            }
          })}
        />
      </Helmet>
      <div className='md:mx-auto md:max-w-3xl lg:max-w-4xl xl:max-w-7xl'>
        <div className='rounded-ms mb-2 flex flex-col bg-white shadow-sm md:mb-3 md:flex-row md:items-start md:justify-between md:p-4 lg:mb-4 lg:p-3 xl:mb-5 xl:p-4'>
          <div className='md:w-[38%]'>
            <div>
              <Image.PreviewGroup>
                <Slider
                  infinite={false}
                  ref={(slider) => setSlider2(slider)}
                  asNavFor={slider1 as Slider}
                  dots={false}
                  beforeChange={(_, next) => {
                    setChange(next)
                  }}
                >
                  {product.images.map((_, i) => (
                    <div>
                      <img
                        key={idProduct}
                        src={product.images[i]}
                        alt={idProduct}
                      />
                    </div>
                  ))}
                </Slider>
              </Image.PreviewGroup>
            </div>
            <div>
              <Slider
                infinite={false}
                ref={(slider) => setSlider1(slider)}
                asNavFor={slider2 as Slider}
                slidesToShow={5}
                slidesToScroll={1}
                dots={false}
                swipeToSlide={true}
                focusOnSelect={true}
                touchMove
                arrows={false}
                beforeChange={(_, next) => {
                  if (next > 0) {
                    if (next < 2) {
                      setChange(next)
                    } else {
                      setChange(change)
                    }
                  } else {
                    setChange(change)
                  }
                }}
              >
                {product.images.map((_, i) => (
                  <div className='odd:py-2 odd:pr-2 even:p-2'>
                    <img
                      className={classNames({
                        'border-2 border-solid border-red': change === i
                      })}
                      key={idProduct}
                      src={product.images[i]}
                      alt={idProduct}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className='md:w-[60%]'>
            <p className='mb-3 px-3 text-sm font-medium line-clamp-2 md:px-0 md:text-base lg:text-lg xl:text-xl'>
              {product.name}
            </p>
            <div className='mb-3 flex px-3 md:px-0'>
              <Rate
                className='text-xs text-rate xl:text-sm'
                disabled
                allowHalf
                defaultValue={4.5}
              />
              <div className='ml-2 h-full w-1 bg-gray-100' />
              <span className='ml-2'>{convertDigitalNumber(product.sold)}</span>
              <div className='ml-3'>Đã bán</div>
            </div>
            <div className='mx-3 mb-1 flex rounded-sm bg-[#FAFAFA] p-2 md:mx-0 md:mb-2 md:p-2 lg:mx-0 lg:mb-2 lg:p-3 xl:mx-0 xl:mb-3 xl:p-5'>
              <div className='mr-2 flex items-center text-gray-300 line-through md:mr-3 lg:mr-3 xl:mr-4'>
                <span>₫</span>
                <span className='text-xs md:text-sm lg:text-base xl:text-lg'>
                  {convertCurrentcy(product.price_before_discount, 0)}
                </span>
              </div>
              <div className='mr-5 text-lg text-red md:text-xl lg:text-2xl xl:text-3xl'>
                <span className='mr-1'>₫</span>
                <span>{convertCurrentcy(product.price, 0)}</span>
              </div>
              <div className='flex items-center'>
                <span className='rounded-sm bg-red px-[3px] py-[0.5px] text-[8px] font-bold text-white md:px-[5px] md:py-[2px] md:text-[10px] lg:px-[6px] lg:py-[3px] lg:text-[10px] xl:px-2 xl:py-1 xl:text-xs'>
                  {rateSale(product.price_before_discount, product.price)} Giảm
                </span>
              </div>
            </div>
            <div className='grid-col-5 m-3 grid gap-y-2 md:m-0 md:px-5 lg:m-0 lg:grid-rows-6 lg:gap-y-2 lg:px-6 xl:m-0 xl:grid-rows-7 xl:gap-y-4 xl:px-7'>
              <div className='col-span-1 col-start-1 row-start-1 text-gray-500'>
                Mã Giảm Giá Của Shop
              </div>
              <div className='col-span-4 col-start-2 row-start-1'>
                <span className='bg-rose-200 px-[6px] py-1 text-rose-500'>
                  Giảm đ20
                </span>
              </div>
              <div className='col-span-1 col-start-1 row-start-2 text-gray-500'>
                Bảo hiểm
              </div>
              <div className='col-span-1 col-start-2 row-start-2'>
                Bảo hiểm Thời trang
              </div>
              <div className='col-span-1 col-start-3 row-start-2 text-blue'>
                Tìm hiểu thêm
              </div>
              <div className='col-span-1 col-start-1 row-start-3 text-gray-500'>
                Vận chuyển
              </div>
              <div className='col-span-3 col-start-2 row-start-3'>
                <div>Miễn phí vận chuyển</div>
                <div>Miễn phí vận chuyển cho đơn hàng trên đ50.000</div>
              </div>
              <div className='col-span-1 col-start-2 row-start-4'>
                <div>Vận chuyển tới</div>
                <div>Phí Vận Chuyển</div>
              </div>
              <div className='col-span-2 col-start-3 row-start-4'>
                <div className='flex items-center'>
                  Phường Linh Trung, Thành phố Thủ Đức
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='ml-2 h-4 w-4'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                    />
                  </svg>
                </div>
                <div>₫0 - ₫22.000</div>
              </div>
              <div className='col-span-1 col-start-1 row-start-5 hidden text-gray-500 md:block lg:block xl:block'>
                Size
              </div>
              <div className='col-span-4 col-start-2 row-start-5 hidden md:block lg:block xl:block'>
                <div className='flex'>
                  <div className='border-[1px] border-gray-200 p-1 md:mr-1 md:px-1 md:py-1 lg:mr-2 lg:px-2 lg:py-1 xl:mr-3 xl:px-3 xl:py-2'>
                    S (50-60kg)
                  </div>
                  <div className='border-[1px] border-gray-200 p-1 md:mr-1 md:px-1 md:py-1 lg:mr-2 lg:px-2 lg:py-1 xl:mr-3 xl:px-3 xl:py-2'>
                    M (60-70kg)
                  </div>
                  <div className='border-[1px] border-gray-200 p-1 md:mr-1 md:px-1 md:py-1 lg:mr-2 lg:px-2 lg:py-1 xl:mr-3 xl:px-3 xl:py-2'>
                    L (70-80kg)
                  </div>
                  <div className='border-[1px] border-gray-200 p-1 md:px-1 md:py-1 lg:px-2 lg:py-1 xl:px-3 xl:py-2'>
                    XL (80-95kg)
                  </div>
                </div>
              </div>
              <div className='col-span-2 col-start-2 row-start-6 hidden items-center text-blue xl:flex xl:text-base'>
                Bảng quy đổi kích cỡ
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='ml-1 lg:h-3 lg:w-3 xl:h-4 xl:w-4'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M8.25 4.5l7.5 7.5-7.5 7.5'
                  />
                </svg>
              </div>
              <div className='col-span-1 col-start-1 row-start-6 my-auto text-gray-500 xl:row-start-7'>
                Số Lượng
              </div>
              <div className='pr-17 col-span-2 col-start-2 row-start-6 my-auto text-gray-500 md:pr-16 lg:pr-12 xl:col-span-1 xl:row-start-7 xl:pr-4'>
                <InputOrder
                  ReduceClassName='p-2'
                  InscreaseClassName='p-2'
                  IconClassName='lg:w-5 lg:h-5 md:w-4 md:h-4 w-3 h-3'
                  setCount={setCount}
                  count={count}
                  amount={product.quantity}
                />
              </div>
              <div className='col-start-4 row-start-6 my-auto text-center text-gray-500 xl:col-start-3 xl:row-start-7'>
                {product.quantity} sản phẩm có sẳn
              </div>
            </div>
            <div className='mb-2 grid grid-cols-9 gap-9 phone:grid-cols-10 md:ml-7 md:grid-cols-10 md:pt-5 lg:ml-7 lg:grid-cols-10 lg:pt-5 lg:text-sm xl:ml-7 xl:grid-cols-10 xl:pt-5 xl:text-base'>
              <button
                onClick={handleAddCart}
                className='col-span-4 col-start-2 flex items-center justify-center border border-red bg-[#FDF3F4] px-2 py-2 text-red phone:px-2 md:col-span-4 md:col-start-1 md:py-2 lg:col-span-4 lg:col-start-1 lg:py-3 xl:col-span-4 xl:col-start-1 xl:py-4'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='mr-1 h-3 w-3 md:mr-2 md:h-4 lg:mr-2 lg:h-5 lg:w-5 xl:mr-3 xl:h-6 xl:w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                  />
                </svg>
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={handleOrder}
                className='col-span-3 col-start-6 bg-red text-white'
              >
                Mua hàng
              </button>
            </div>
          </div>
          {/* </div> */}
        </div>
        <div className='rounded-sm bg-white p-3 md:p-4 lg:p-5 xl:p-7'>
          <div className='mb-2 bg-[#f5f5f5] p-2 text-sm font-bold uppercase md:p-3 md:text-base lg:p-4 lg:text-lg xl:mb-5 xl:p-5 xl:text-xl'>
            chi tiết sản phẩm
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.description)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
