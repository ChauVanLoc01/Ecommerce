import * as yup from 'yup'

export const login_schema = yup.object({
    username: yup.string().required('Không được bỏ trống'),
    password: yup.string().required('Không được bỏ trống')
})

export const register_schema = yup.object({
    full_name: yup.string().required('Không được bỏ trống'),
    email: yup.string().email('Không đúng định dạng').required('Không được bỏ trống'),
    username: yup.string().required('Không được bỏ trống'),
    password: yup.string().required('Không được bỏ trống'),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('password')], 'Không trùng khớp')
        .required('Không được bỏ trống')
})

export type RegisterSchemaType = yup.InferType<typeof register_schema>
