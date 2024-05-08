import { EmployeeListResponse, EmployeeQuery } from 'src/types/employee.type'
import { http } from './http'

export const EmployeeApi = {
    getAllEmployee: (query: EmployeeQuery) => {
        return http.get<EmployeeListResponse>('user/employee', {
            params: query
        })
    }
}
