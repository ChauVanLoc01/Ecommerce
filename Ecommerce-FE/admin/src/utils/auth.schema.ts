import * as yup from 'yup'

export const register_schema = yup.object({
    full_name: yup.string().required('Bắt buộc'),
    email: yup.string().email().required('Bắt buộc'),
    username: yup.string().required('Bắt buộc'),
    password: yup.string().min(6, 'Ít nhất 6 kí tự').required('Bắt buộc'),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('password')], 'Không trùng khớp')
        .required('Bắt buộc')
})

export type RegisterSchemaType = yup.InferType<typeof register_schema>

export const login_schema = yup.object({
    username: yup.string().required('Bắt buộc'),
    password: yup.string().min(6, 'Ít nhất 6 kí tự').required('Bắt buộc')
})

export type LoginSchemaType = yup.InferType<typeof login_schema>
