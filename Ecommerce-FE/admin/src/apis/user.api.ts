import { OrderStatus } from 'src/constants/store.constants'
import { IsThereStore } from 'src/types/store.type'
import { UserQuery, Users } from 'src/types/user.type'
import { http } from './http'

export const user_api = {
    getUsers: (params: UserQuery) => () => {
        return http.get<Users>('user/profile/all-user', { params })
    },
    isThereStore: (userId: string) => () => {
        return http.get<IsThereStore>(`store/store/admin/is-there-store/${userId}`)
    },
    updateStatusOfUser: (userId: string) => (body: { status: OrderStatus }) => {
        return http.put(`user/profile/admin/${userId}`, body)
    }
}
