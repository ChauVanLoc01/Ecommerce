import * as yup from 'yup'

export const update_product_schema = yup.object({
    name: yup.string().optional(),
    status: yup.string().optional(),
    category: yup.string().optional(),
    priceAfter: yup.number().optional(),
    priceBefore: yup.number().optional(),
    initQuantity: yup.number().optional()
})

export const create_product_schema = yup.object({
    name: yup.string().required('Bắt buộc'),
    description: yup.string().optional(),
    priceAfter: yup.number().required('Bắt buộc'),
    priceBefore: yup.number().optional(),
    initQuantity: yup.number().required('Bắt buộc'),
    status: yup.string().required('Bắt buộc'),
    category: yup.string().required('Bắt buộc')
})

export type UpdateProductSchema = yup.InferType<typeof update_product_schema>

export type CreateProductSchema = yup.InferType<typeof create_product_schema>
