import { useEffect, useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import InputNumber from 'src/components/InputNumber'
import { ProductKeySearch, ProductSearch } from 'src/constants/KeySearch'
import useIdHook from 'src/hooks/useIdHook'
import { ListCategory } from 'src/types/Category.type'
import { PriceFormSchema, PriceFormSchemaType } from 'src/utils/rules'
import Rate from 'antd/lib/rate'
import { createPortal } from 'react-dom'

type bgToggleType = {
  visible: boolean
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
}

const BackgroundToggle = ({ visible, setToggle }: bgToggleType) => {
  return createPortal(
    <div
      onClick={() => setToggle(!visible)}
      className={`z-40 md:hidden lg:hidden xl:hidden ${classNames({
        'absolute bottom-0 left-0 top-0 w-screen bg-zinc-600/30': visible
      })}`}
    />,
    document.getElementById('root') as HTMLElement
  )
}

type AsideProps = {
  categories: ListCategory
  ObjectKeySearch: ProductSearch
  joinKeySearch: (fieldsToUpdate: Partial<ProductSearch>) => string
}

function Aside({ categories, ObjectKeySearch, joinKeySearch }: AsideProps) {
  const id = useIdHook()
  const [toggle, setToggle] = useState<boolean>(false)
  const navigate = useNavigate()
  const {
    trigger,
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm<PriceFormSchemaType>({
    defaultValues: { price_min: '', price_max: '' },
    resolver: yupResolver(PriceFormSchema)
  })
  const onSubmit = handleSubmit((data) => {
    if (data.price_min !== '' && data.price_max !== '') {
      navigate(
        joinKeySearch({
          price_min: Number(data.price_min),
          price_max: Number(data.price_max),
          page: 1
        })
      )
    } else if (data.price_min !== '' && data.price_max === '') {
      navigate(
        joinKeySearch({
          price_min: Number(data.price_min),
          page: 1
        })
      )
    } else if (data.price_min === '' && data.price_max !== '') {
      navigate(
        joinKeySearch({
          price_max: Number(data.price_max),
          page: 1
        })
      )
    } else if (data.price_min === '' && data.price_max === '') {
      navigate(joinKeySearch({ page: 1 }))
    }
  })
  const checkUniqueCategoryPropertyOfObjectKeySearch = (O: ProductSearch) => {
    const keys = Object.keys(ObjectKeySearch)
    if (keys.length === 3 && ObjectKeySearch.category) {
      return true
    }
    return false
  }

  const handleRating = (rating: number) => () => {
    navigate(`${joinKeySearch({ page: 1, rating_filter: rating })}`)
  }

  useEffect(() => {
    checkUniqueCategoryPropertyOfObjectKeySearch(ObjectKeySearch) && reset()
  }, [ObjectKeySearch])

  return (
    <div className='relative mb-2 md:mb-0 md:pl-0 md:pt-2 lg:mb-0 lg:pl-0 lg:pt-2 xl:mb-0 xl:pl-0 xl:pt-2'>
      <button
        onClick={() => setToggle(!toggle)}
        className='ml-2 flex items-center text-xs duration-500 md:hidden lg:hidden xl:hidden'
      >
        {!toggle ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='mr-1 h-[10px] w-[10px] cursor-pointer'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75'
            />
          </svg>
        ) : (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='mr-1 h-[10px] w-[10px] cursor-pointer'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        )}
        Filter
      </button>
      <BackgroundToggle setToggle={setToggle} visible={toggle} />
      <div
        className={`absolute rounded-sm bg-white px-5 py-3 text-[10px] shadow-sm phone:text-xs md:static md:flex md:translate-x-[0%] md:flex-col md:rounded-none md:bg-[#F5f5f5] md:p-0 md:text-xs md:shadow-none lg:static lg:flex lg:translate-x-[0%] lg:flex-col lg:space-y-6 lg:rounded-none lg:bg-[#F5f5f5] lg:p-0 lg:text-xs lg:shadow-none xl:static xl:flex xl:translate-x-[0%] xl:flex-col xl:space-y-10 xl:rounded-none xl:bg-[#F5f5f5] xl:p-0 xl:text-sm xl:shadow-none ${classNames(
          {
            'z-50 translate-x-[-2%] duration-500 ease-in-out': toggle,
            'translate-x-[-120%] duration-500 ease-in-out': !toggle
          }
        )}`}
      >
        <div>
          <span className='mb-2 flex items-center text-xs font-bold capitalize xl:text-sm'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='mr-2 h-2 w-2 md:h-3 md:w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
              />
            </svg>
            Tất cả danh mục
          </span>
          <div className='mb-4 h-[1px] border-b-[1px]' />
          {categories.slice(0, 3).map((c) => (
            <Link
              key={c._id}
              to={`?${ProductKeySearch.category}=${c._id}`}
              className='mb-4 flex items-center pr-2'
            >
              {ObjectKeySearch.category &&
                c._id === ObjectKeySearch.category && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='mr-2 flex h-[6px] w-[6px] flex-shrink-0 text-primary md:h-[8px] md:w-[8px] lg:h-[10px] lg:w-[10px] xl:h-[10px] xl:w-[10px]'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5'
                    />
                  </svg>
                )}
              <div
                className={classNames('truncate', {
                  'ml-3 text-primary':
                    ObjectKeySearch.category &&
                    c._id === ObjectKeySearch.category,
                  'ml-5 pl-[12px] md:pl-[12px] lg:pl-[10px] xl:pl-[10px]':
                    (ObjectKeySearch.category &&
                      c._id !== ObjectKeySearch.category) ||
                    !ObjectKeySearch.category
                })}
              >
                {c.name}
              </div>
            </Link>
          ))}
        </div>
        <div>
          <div className='mb-2 flex items-center text-xs font-bold capitalize xl:text-sm'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='mr-2 h-2 w-2 md:h-3 md:w-3 lg:h-3 lg:w-3 xl:h-4 xl:w-4'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
              />
            </svg>
            BỘ LỌC TÌM KIẾM
          </div>
          <div className='border-b-[1px] lg:mb-5 lg:pb-3 xl:mb-7 xl:pb-5'>
            <div className='my-3 md:my-3 lg:my-3 xl:my-4'>Đánh giá</div>
            <div className='flex flex-col-reverse'>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    className='mb-4 flex items-end'
                    onClick={handleRating(i + 2)}
                  >
                    <div
                      className={`flex items-center px-3 xl:px-4 ${classNames({
                        'rounded-full bg-[#EBEBEB]':
                          ObjectKeySearch.rating_filter === i + 2
                      })}`}
                    >
                      <div className='mr-3 md:mr-2 xl:mr-4'>
                        <Rate
                          className='pb-[4px] xl:pb-[6px]'
                          rootClassName='text-rate text-[10px] lg:text-[12px] xl:text-sm cursor-pointer'
                          disabled
                          allowHalf
                          defaultValue={i + 2}
                        />
                      </div>
                      <div>{i + 2 < 5 ? 'trở lên' : ''}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <div className='mb-2 border-b-[1px] pb-2 md:mb-3 md:pb-3 lg:mb-5 lg:pb-4 xl:mb-7 xl:pb-5'>
            <div className='my-4 flex'>Khoảng giá</div>
            <form className='mb-4 flex flex-col' onSubmit={onSubmit}>
              <div className='mb-1 flex items-center justify-between'>
                <InputNumber
                  className={
                    'h-7 max-w-[43%] rounded-sm border bg-white px-2 outline-none phone:px-3 md:h-8 md:px-3 lg:h-8 lg:px-3 xl:h-9 xl:px-3'
                  }
                  placeholder='₫ TỪ'
                  {...register('price_min')}
                  triggerName='price_max'
                  trigger={trigger}
                  err={errors.price_max}
                  value={getValues('price_min')}
                />
                <InputNumber
                  className='h-7 max-w-[43%] rounded-sm border px-2 outline-none phone:px-3 md:h-8 md:px-3 lg:h-8 lg:px-3 xl:h-9 xl:px-3'
                  placeholder='₫ ĐẾN'
                  {...register('price_max')}
                  triggerName='price_min'
                  trigger={trigger}
                  err={errors.price_max}
                  value={getValues('price_max')}
                />
              </div>
              <div className='mb-1 min-h-[15px] max-w-full text-red'>
                {errors && <span>{errors.price_max?.message}</span>}
              </div>
              {errors.price_max && errors.price_min ? (
                <input
                  className='cursor-pointer rounded-sm bg-primary py-2 uppercase text-white xl:py-3'
                  type='button'
                  value='Áp dụng'
                />
              ) : (
                <input
                  className='cursor-pointer rounded-sm bg-primary py-2 uppercase text-white xl:py-3'
                  type='submit'
                  value='Áp dụng'
                />
              )}
            </form>
          </div>
          <div className='border-b-[1px]'>
            <button
              onClick={() => {
                navigate('/')
                reset()
              }}
              className='w-full cursor-pointer rounded-sm bg-primary py-2 uppercase text-white xl:py-3'
            >
              XÓA TẤT CẢ
            </button>
          </div>
        </div>
        <button
          onClick={() => setToggle(!toggle)}
          className='absolute right-2 top-2 duration-300 hover:text-gray-300 md:hidden lg:hidden xl:hidden'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='h-4 w-4'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Aside
