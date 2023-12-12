import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { LoginSchema, LoginSchemaType, RegisterSchema } from 'src/utils/rules'
import Input from 'src/components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { AuthFetching } from 'src/Api/AthFetching'
import { isUnprocessableEntityError } from 'src/Api/AxiosError'
import { useContext } from 'react'
import { Context } from 'src/context/AppContext'
import Button from 'src/components/Button'
import { ResponveApi } from 'src/types/Responve.type'
import useIdHook from 'src/hooks/useIdHook'
import { Helmet } from 'react-helmet-async'

export default function Login() {
  const id = useIdHook()
  const { setIsAuth, setUser } = useContext(Context)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginSchemaType>({
    resolver: yupResolver(LoginSchema)
  })
  const loginMutation = useMutation({
    mutationFn: (body: LoginSchemaType) => AuthFetching.LoginFetching(body)
  })
  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data, {
      onError(error) {
        if (isUnprocessableEntityError<ResponveApi<LoginSchemaType>>(error)) {
          const data = error.response?.data.data
          data &&
            Object.keys(data).forEach((key) =>
              setError(key as keyof LoginSchemaType, {
                message: data[key as keyof LoginSchemaType]
              })
            )
        }
      },
      onSuccess(data) {
        setUser(data.data.data.user)
        setIsAuth(true)
      }
    })
  })
  return (
    <div className='bg-primary'>
      <Helmet>
        <title>Đăng nhập | TechShop</title>
        <meta name='description' content='Đăng nhập vào TechShop' />
      </Helmet>
      <div className='bg-bgPrimary lg:mx-auto lg:max-w-5xl lg:bg-right lg:p-4'>
        <div className='lg:grid lg:grid-cols-5 lg:py-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form
              className='rounded bg-white p-10 shadow-sm'
              onSubmit={onSubmit}
            >
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                key={id}
                type='text'
                className='mt-8'
                placeHolder='Email'
                register={register}
                name='email'
                errorMessage={errors.email?.message}
              />
              <Input
                type='password'
                className='mt-3'
                placeHolder='Password'
                register={register}
                name='password'
                errorMessage={errors.password?.message}
                autoComplete='true'
              />
              <Button
                classNameBlock='mt-3'
                errors={errors}
                isLoading={loginMutation.isLoading}
              />
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='text-red-400 ml-1' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
