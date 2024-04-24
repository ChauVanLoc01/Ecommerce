import * as yup from 'yup'

export const update_product_schema = yup.object({
    name: yup.string().optional(),
    status: yup.string().optional(),
    category: yup.string().optional(),
    priceAfter: yup.number().optional(),
    priceBefore: yup.number().optional(),
    initQuantity: yup.number().optional()
})

export type UpdateProductSchema = yup.InferType<typeof update_product_schema>
