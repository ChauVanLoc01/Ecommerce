import * as yup from 'yup'

export const create_voucher_schema = yup.object().shape({
    code: yup.string().max(100, 'Tối đa 100 kí tự').required('Bắt buộc'),
    title: yup.string().max(255, 'Tối đa 255 kí tự').required('Bắt buộc'),
    description: yup.string().required('Bắt buộc'),
    initQuantity: yup.number().integer().min(0).required('Bắt buộc'),
    status: yup.string().required('Bắt buộc'),
    type: yup.string().required('Bắt buộc'),
    percent: yup.number().min(0).max(100).required('Bắt buộc'),
    maximum: yup.number().min(0).required('Bắt buộc'),
    category: yup.string().required('Bắt buộc'),
    totalMin: yup.number().min(0).required('Bắt buộc'),
    priceMin: yup.number().min(0).required('Bắt buộc'),
    startDate: yup.date().required('Bắt buộc'),
    endDate: yup.date().min(yup.ref('startDate'), 'Ngày kết thúc phải lớn hơn ngày bắt đầu').optional()
})

export type CreateVoucher = yup.InferType<typeof create_voucher_schema>

export const update_voucher_schema = create_voucher_schema.deepPartial()

export type UpdateVoucher = yup.InferType<typeof update_voucher_schema>
