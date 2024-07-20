import { UserQuery, Users } from 'src/types/user.type'
import { http } from './http'

export const user_api = {
    getUsers: (params: UserQuery) => () => {
        return http.get<Users>('user/profile/all-user', { params })
    },
    updateStatusOfUser: (userId: string) => (body: any) => {
        return http.post(`/user/auth/user-admin/${userId}`, body)
    }
}
