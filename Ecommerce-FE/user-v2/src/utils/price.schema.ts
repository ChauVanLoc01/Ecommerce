import * as yup from 'yup'

export const price_schema = yup.object({
    price_min: yup.number().oneOf([yup.ref('price_max')]),
    price_max: yup.number().oneOf([yup.ref('price_min')])
})
