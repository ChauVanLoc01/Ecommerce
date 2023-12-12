import * as yup from 'yup'
import type { InferType } from 'yup'
import { AnyObject } from 'yup/lib/types'

function testPriceMinMax(this: yup.TestContext<AnyObject>) {
  const { price_max, price_min } = this.parent as {
    price_min: string
    price_max: string
  }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) > Number(price_min)
  }
  return (
    price_min !== '' ||
    price_max !== '' ||
    (price_min === '' && price_max == '')
  )
}

export const schema = yup.object({
  email: yup
    .string()
    .email('Email không đúng địng dạng!')
    .required('Email là bắt buộc!')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 160 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref('password')], 'Nhập lại password không đúng!'),
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  })
})

export const profile = yup.object({
  name: yup.string().trim().max(160, 'Tên đăng nhập tối đa 160 kí tự'),
  phone: yup.string().trim().max(20, 'Số điện thoại tối đa 20 kí tự'),
  address: yup.string().trim().max(160, 'Địa chỉ tối đa 160 kí tự'),
  date_of_birth: yup.string().trim(),
  avatar: yup.string().trim().max(1000, 'tối đa 1000 kí tự')
})

export type SchemaType = InferType<typeof schema>

export type RegisterSchemaType = Pick<
  SchemaType,
  'email' | 'password' | 'confirm_password'
>

export const RegisterUnionSchema =
  schema.pick(['email']) ||
  schema.pick(['password']) ||
  schema.pick(['confirm_password'])

export const RegisterSchema = schema.pick([
  'email',
  'password',
  'confirm_password'
])

export type LoginSchemaType = Pick<SchemaType, 'email' | 'password'>

export const LoginSchema = schema.pick(['email', 'password'])

export type PriceFormSchemaType = Pick<SchemaType, 'price_max' | 'price_min'>

export const PriceFormSchema = schema.pick(['price_max', 'price_min'])

export type PriceFormUnionSchemaType = keyof Pick<
  SchemaType,
  'price_max' | 'price_min'
>

export const OrderSchema = yup.object({
  amount: yup.string().trim()
})

export type OrderSchemaType = InferType<typeof OrderSchema>

export type ProfileType = InferType<typeof profile>

export const PasswordProfileSchema = yup.object({
  newPassword: yup.string().required('Nhập lại password hiện tại là bắt buộc'),
  password: schema.fields['password'],
  confirm_password: schema.fields['confirm_password']
})

export type PasswordProfileType = InferType<typeof PasswordProfileSchema>
