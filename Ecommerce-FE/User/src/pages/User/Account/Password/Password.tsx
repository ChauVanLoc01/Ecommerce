import { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import classNames from 'classnames'
import { useForm } from 'react-hook-form'
import { WorkingWithLS } from 'src/utils/LocalStorage'
import {
  LoginSchemaType,
  PasswordProfileSchema,
  PasswordProfileType
} from 'src/utils/rules'
import { Context } from 'src/context/AppContext'
import { useMutation } from '@tanstack/react-query'
import { AuthFetching } from 'src/Api/AthFetching'
import produce from 'immer'
import useUpdateUser from 'src/hooks/useUpdateUser'
import axios, { AxiosError, HttpStatusCode, isAxiosError } from 'axios'
import { ResponveApi } from 'src/types/Responve.type'
import { OptionUser, User } from 'src/types/User'
import { Helmet } from 'react-helmet-async'

type inputVisibleType = {
  newPassword: boolean
  password: boolean
  confirm_password: boolean
}

function Password() {
  const [visible, setVisible] = useState<inputVisibleType>({
    newPassword: false,
    password: false,
    confirm_password: false
  })
  const UpdateUserMutation = useUpdateUser(false)
  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset
  } = useForm<PasswordProfileType>({
    defaultValues: {
      newPassword: '',
      password: '',
      confirm_password: ''
    },
    resolver: yupResolver(PasswordProfileSchema)
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await UpdateUserMutation.mutateAsync({
        password: data.newPassword,
        new_password: data.password
      })
      res &&
        reset({
          newPassword: '',
          confirm_password: '',
          password: ''
        })
    } catch (error) {
      if (
        isAxiosError<ResponveApi<{ password: string }>>(error) &&
        error.response?.status === HttpStatusCode.UnprocessableEntity
      ) {
        setError('newPassword', {
          message: error.response.data.data.password
        })
      }
    }
  })
  return (
    <div className='select-none rounded-sm bg-product p-6 shadow-sm'>
      <Helmet>
        <title>Thay đổi mật khẩu</title>
        <meta name='description' content='Thay đổi mật khẩu người dùng' />
      </Helmet>
      <div className='border-b-[1px] border-b-gray-300 pb-3'>
        <h2 className='text-lg capitalize'>Đổi mật khẩu</h2>
        <p className='mt-1 text-gray-500'>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className='mt-8 grid grid-cols-7 grid-rows-4 flex-col items-center gap-8'
      >
        <label
          htmlFor='ps'
          className='col-span-2 col-start-1 row-start-1 text-end capitalize text-gray-400'
        >
          Mật khẩu hiện tại
        </label>
        <div className='relative col-span-4 col-start-3 row-start-1 flex'>
          <input
            className={`grow rounded-sm border-[1px] border-gray-300 py-2 pl-3 pr-12 outline-none lg:py-2 xl:py-3 ${classNames(
              {
                'border-primary': errors.newPassword
              }
            )}`}
            type={visible.newPassword ? 'text' : 'password'}
            id='ps'
            {...register('newPassword')}
          />
          <span
            className={`absolute top-0 left-2 -translate-y-[50%] bg-product px-2 font-sans text-[10px] italic text-primary opacity-0 md:text-xs xl:text-sm ${classNames(
              {
                'opacity-100': errors.newPassword
              }
            )}`}
          >
            {errors.newPassword?.message}
          </span>
          <span
            onClick={() =>
              setVisible({ ...visible, newPassword: !visible.newPassword })
            }
            className='absolute right-[-32px] top-[50%] -translate-y-[50%] cursor-pointer phone:right-[-4px] md:right-4'
          >
            {visible.newPassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3 md:h-4 md:w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3 md:h-4 md:w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                />
              </svg>
            )}
          </span>
        </div>

        <label
          htmlFor='nps'
          className='col-span-2 col-start-1 row-start-2 text-end capitalize text-gray-400'
        >
          Mật khẩu mới
        </label>
        <div className='relative col-span-4 col-start-3 row-start-2 flex'>
          <input
            className={`grow rounded-sm border-[1px] border-gray-300 py-2 pl-3 pr-12 outline-none lg:py-2 xl:py-3 ${classNames(
              {
                'border-primary': errors.password
              }
            )}`}
            type={visible.password ? 'text' : 'password'}
            id='nps'
            {...register('password')}
          />
          <span
            className={`absolute top-0 left-2 -translate-y-[50%] bg-product px-2 font-sans text-[10px] italic text-primary opacity-0 md:text-xs xl:text-sm ${classNames(
              {
                'opacity-100': errors.password
              }
            )}`}
          >
            {errors.password?.message}
          </span>
          <span
            onClick={() =>
              setVisible({ ...visible, password: !visible.password })
            }
            className='absolute right-[-32px] top-[50%] -translate-y-[50%] cursor-pointer phone:right-[-4px] md:right-4'
          >
            {visible.password ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3 md:h-4 md:w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3 md:h-4 md:w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                />
              </svg>
            )}
          </span>
        </div>

        <label
          htmlFor='cps'
          className='col-span-2 col-start-1 row-start-3 text-end capitalize text-gray-400'
        >
          Xác nhận mật khẩu
        </label>
        <div className='relative col-span-4 col-start-3 row-start-3 flex'>
          <input
            className={`grow rounded-sm border-[1px] border-gray-300 py-2 pl-3 pr-12 outline-none lg:py-2 xl:py-3 ${classNames(
              {
                'border-primary': errors.confirm_password
              }
            )}`}
            type={visible.confirm_password ? 'text' : 'password'}
            id='cps'
            {...register('confirm_password')}
          />
          <span
            className={`absolute top-0 left-2 -translate-y-[50%] bg-product px-2 font-sans text-[10px] italic text-primary opacity-0 md:text-xs xl:text-sm ${classNames(
              {
                'opacity-100': errors.confirm_password
              }
            )}`}
          >
            {errors.confirm_password?.message}
          </span>
          <span
            onClick={() =>
              setVisible({
                ...visible,
                confirm_password: !visible.confirm_password
              })
            }
            className='absolute right-[-32px] top-[50%] -translate-y-[50%] cursor-pointer phone:right-[-4px] md:right-4'
          >
            {visible.confirm_password ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3 md:h-4 md:w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-3 w-3 md:h-4 md:w-4'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                />
              </svg>
            )}
          </span>
        </div>
        <input
          type='submit'
          className='col-span-2 col-start-3 row-start-4 cursor-pointer bg-primary py-2 text-white duration-150 hover:bg-primary/90 md:py-2 lg:py-2 xl:py-3'
          value={'Lưu'}
        />
      </form>
    </div>
  )
}

export default Password
