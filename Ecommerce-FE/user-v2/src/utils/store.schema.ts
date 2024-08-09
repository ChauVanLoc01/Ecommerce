import * as yup from 'yup'

export const register_store_schema = yup.object({
    name: yup.string().required('bắt buộc'),
    location: yup.string().required('bắt buộc'),
    tax: yup.string().optional()
})

export type RegisterStoreSchemaType = yup.InferType<typeof register_store_schema>
