import { InferType, object, string } from 'yup'

export const register_employee_schema = object({
    full_name: string().required('Bắt buộc'),
    email: string().email().required('Bắt buộc'),
    username: string().required('Bắt buộc'),
    password: string().min(6, 'Ít nhất 6 kí tự').required('Bắt buộc')
})
export const edit_employee_schema = register_employee_schema.pick(['password'])

export type CreateEmployee = InferType<typeof register_employee_schema>
export type EditEmployee = Pick<CreateEmployee, 'password'>
