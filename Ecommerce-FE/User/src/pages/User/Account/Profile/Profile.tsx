import { useMutation, useQuery } from '@tanstack/react-query'
import DatePicker from 'antd/lib/date-picker'
import dayjs from 'dayjs'
import { UserFetching } from 'src/Api/UserFetching'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { ProfileType, profile } from 'src/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useRef } from 'react'
import { useState } from 'react'
import useUpdateUser from 'src/hooks/useUpdateUser'
import { urlApi } from 'src/constants/config'
import { getTimeToIso } from 'src/utils/utils'
import { toast } from 'react-toastify'
import classNames from 'classnames'
import { Helmet } from 'react-helmet-async'

const LimitSize = 1024000

function Profile() {
  const ref = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const updateUserMutation = useUpdateUser()
  const updateAvatarMutation = useMutation(UserFetching.updateAvatar)
  const {
    register,
    reset,
    control,
    getValues,
    formState: { errors },
    setValue,
    handleSubmit
  } = useForm<ProfileType>({
    defaultValues: {
      name: '',
      phone: '',
      date_of_birth: new Date().toISOString(),
      avatar: '',
      address: ''
    },
    resolver: yupResolver(profile)
  })
  const getUserFetching = useQuery({
    queryKey: ['user'],
    queryFn: UserFetching.GetUserFetching
  })
  const user = getUserFetching.data?.data.data
  const onSubmit: SubmitHandler<ProfileType> = async (data) => {
    try {
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const resAvatar = await updateAvatarMutation.mutateAsync(form)
        setValue('avatar', resAvatar.data.data)
        setFile(null)
      }
      await updateUserMutation.mutate(data)
    } catch (error) {
      toast.error('Error Submit', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    }
  }
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ref.current?.setAttribute('value', '')
    const file = e.target.files?.[0] as File
    if (file && (file.size >= LimitSize || !file.type.includes('image'))) {
      toast.error('File không hợp lệ', {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      })
    } else {
      setFile(file)
    }
  }
  useEffect(() => {
    if (user) {
      reset({
        avatar: user.avatar || '',
        date_of_birth: user.date_of_birth || new Date().toISOString(),
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [getUserFetching.isSuccess, getUserFetching.isRefetching])
  if (!user) {
    return null
  }
  return (
    <div className='rounded-sm bg-product p-2 shadow-sm phone:p-5 md:p-6'>
      <Helmet>
        <title>Thông tin cá nhân</title>
        <meta
          name='description'
          content='Thông tin cá nhân của người dùng TechShop'
        />
      </Helmet>
      <div className='border-b-[1px] border-b-gray-300 pb-3'>
        <h2 className='text-lg capitalize'>hồ sơ của tôi</h2>
        <p className='mt-1 text-gray-500'>
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>
      <div className='flex flex-col-reverse lg:flex-row'>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='mt-8 grid grid-cols-3 grid-rows-6 items-center gap-x-8 gap-y-5 lg:w-[60%]'
        >
          <label
            htmlFor='dn'
            className='col-start-1 row-start-1 text-end text-gray-400'
          >
            Tên đăng nhập
          </label>
          <div className='relative col-span-2 col-start-2 row-start-1 flex'>
            <input
              className={`grow rounded-sm border-[1px] border-gray-300 px-2 py-2 outline-none xl:px-3 xl:py-3 ${classNames(
                {
                  'border-primary': errors.name
                }
              )}`}
              type='text'
              id='dn'
              {...register('name')}
            />
            <span
              className={`absolute left-2 top-0 -translate-y-[50%] bg-product px-2 font-sans text-xs italic text-primary opacity-0 ${classNames(
                {
                  'opacity-100': errors.name
                }
              )}`}
            >
              {errors.name?.message}
            </span>
          </div>

          <label className='col-start-1 row-start-2 text-end text-gray-400'>
            Email
          </label>
          <label className='col-span-3 col-start-2 row-start-2'>
            {user?.email}
          </label>

          <label
            htmlFor='phone'
            className='col-start-1 row-start-3 text-end text-gray-400'
          >
            Số điện thoại
          </label>
          <div className='relative col-span-2 col-start-2 row-start-3 flex'>
            <input
              className={`p grow rounded-sm border-[1px] border-gray-300 px-2 py-2 outline-none xl:px-3 xl:py-3 ${classNames(
                {
                  'border-primary': errors.phone
                }
              )}`}
              type='text'
              id='phone'
              {...register('phone')}
            />
            <span
              className={`absolute left-2 top-0 -translate-y-[50%] bg-product px-2 font-sans text-xs italic text-primary opacity-0 ${classNames(
                {
                  'opacity-100': errors.phone
                }
              )}`}
            >
              {errors.phone?.message}
            </span>
          </div>

          <label
            htmlFor='dc'
            className='col-start-1 row-start-4 text-end text-gray-400'
          >
            Địa chỉ
          </label>
          <div className='relative col-span-2 col-start-2 row-start-4 flex'>
            <input
              className={`p grow rounded-sm border-[1px] border-gray-300 px-2 py-2 outline-none xl:px-3  xl:py-3 ${classNames(
                {
                  'border-primary': errors.address
                }
              )}`}
              type='text'
              id='dc'
              {...register('address')}
            />
            <span
              className={`absolute left-2 top-0 -translate-y-[50%] bg-product px-2 font-sans text-xs italic text-primary opacity-0 ${classNames(
                {
                  'opacity-100': errors.address
                }
              )}`}
            >
              {errors.address?.message}
            </span>
          </div>

          <label
            {...register('date_of_birth')}
            className='col-start-1 row-start-5 text-end text-gray-500'
          >
            Ngày sinh
          </label>
          <div className='col-span-2 col-start-2 row-start-5 xl:col-span-1'>
            <Controller
              name='date_of_birth'
              control={control}
              render={({ field, fieldState }) => (
                <DatePicker
                  className='rounded-sm p-2 font-semibold xl:p-3'
                  disabledDate={(current) =>
                    current && current.valueOf() > Date.now()
                  }
                  onChange={(_, dateString) =>
                    field.onChange(
                      dateString
                        ? new Date(
                            dateString.split('-').reverse().join('-')
                          ).toISOString()
                        : getValues('date_of_birth')
                    )
                  }
                  status={fieldState.error ? 'error' : undefined}
                  name={field.name}
                  value={dayjs(
                    getTimeToIso(getValues('date_of_birth') as string),
                    'DD-MM-YYYY'
                  )}
                  format={'DD-MM-YYYY'}
                />
              )}
            />
          </div>
          <input
            type='submit'
            className='col-start-2 row-start-6 cursor-pointer bg-primary p-2 text-white hover:bg-primary/90 xl:p-3'
            value='Lưu'
          />
        </form>
        <div className='align-middle lg:w-[40%]'>
          <div className='mt-8 flex flex-col items-center justify-center pb-10 lg:border-l-[1px]'>
            {getValues('avatar') || file ? (
              <img
                className='h-28 w-28 rounded-full border-[1px] border-gray-100 object-cover'
                src={
                  file
                    ? URL.createObjectURL(file)
                    : getValues('avatar')
                    ? `${urlApi}images/${getValues('avatar')}`
                    : ''
                }
                alt='avatar'
              />
            ) : (
              <div className='mb-5 rounded-full bg-gray-100 p-5'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-20 w-20 text-gray-300'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
                  />
                </svg>
              </div>
            )}
            <input
              onChange={onFileChange}
              ref={ref}
              className='invisible'
              type='file'
              accept='image/*'
            />
            <button
              onClick={() => ref.current?.click()}
              className='mb-5 rounded-sm border-[1px] px-5 py-2 shadow-sm hover:bg-gray-50'
            >
              Chọn ảnh
            </button>
            <div className='px-14 text-center'>
              Dụng lượng file tối đa 1 MB Định dạng: Image/*
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
