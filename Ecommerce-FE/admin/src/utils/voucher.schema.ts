import * as yup from 'yup'

export const create_voucher_schema = yup.object().shape({
    code: yup
        .string()
        .uppercase('Phải là chữ in hoa')
        .matches(/^[A-Z0-9]*$/, 'Không được chứa ký tự có dấu hoặc ký tự đặc biệt')
        .max(100, 'Tối đa 100 kí tự')
        .required('Bắt buộc'),
    title: yup.string().max(255, 'Tối đa 255 kí tự').required('Bắt buộc'),
    type: yup.string().default('STORE'),
    description: yup.string().optional(),
    initQuantity: yup.number().integer().min(0).required('Bắt buộc'),
    status: yup.string().required('Bắt buộc'),
    percent: yup.number().min(0).max(100, 'Tối đa 100%').optional(),
    maximum: yup.number().min(0).required('Bắt buộc'),
    category: yup.string().optional(),
    totalMin: yup.number().min(0).optional(),
    priceMin: yup.number().min(0).optional(),
    startDate: yup.date().required('Bắt buộc'),
    endDate: yup.date().min(yup.ref('startDate'), 'Ngày kết thúc phải lớn hơn ngày bắt đầu').optional()
})

export type CreateVoucher = yup.InferType<typeof create_voucher_schema>

export const update_voucher_schema = create_voucher_schema.deepPartial()

export type UpdateVoucher = yup.InferType<typeof update_voucher_schema>
