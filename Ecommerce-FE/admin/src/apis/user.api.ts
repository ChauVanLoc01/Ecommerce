import { OrderStatus } from 'src/constants/store.constants'
import { UserQuery, Users } from 'src/types/user.type'
import { http } from './http'

export const user_api = {
    getUsers: (params: UserQuery) => () => {
        return http.get<Users>('user/profile/all-user', { params })
    },
    updateStatusOfUser: (userId: string) => (body: { status: OrderStatus }) => {
        return http.put(`/user/profile/admin/${userId}`, body)
    }
}
