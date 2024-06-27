import * as yup from 'yup'

export const create_rating_schema = yup.object().shape({
    // productId: yup.string().max(50).required(),
    // storeId: yup.string().max(50).required(),
    // orderId: yup.string().max(50).required(),
    comment: yup.string()
})

export type CreateRating = yup.InferType<typeof create_rating_schema>
