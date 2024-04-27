import * as yup from 'yup'

export const profile_schema = yup.object({
    full_name: yup.string().max(50, 'Tối đa 50 kí tự').notRequired(),
    email: yup.string().email('Email không đúng định dạng').notRequired(),
    address: yup.string().max(200, 'Tối đa 50 kí tự').notRequired()
})

export const change_password_schema = yup.object({
    current_password: yup.string().max(50, 'Tối đa 50 kí tự').required('Không được để trống'),
    new_password: yup.string().required('Không được để trống'),
    confirm_new_password: yup
        .string()
        .oneOf([yup.ref('new_password')], 'Không trùng khớp')
        .required('Không được để trống')
})

export type ProfileSchemaType = yup.InferType<typeof profile_schema>
export type ChangePasswordSchemaType = yup.InferType<typeof change_password_schema>
