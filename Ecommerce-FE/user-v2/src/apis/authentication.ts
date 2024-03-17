import { LoginBody, LoginResponse, RegisterBody, RegisterResponse } from 'src/types/auth.type'
import { method } from './method'
import { Return } from 'src/types/return.type'
import { user } from 'src/constants/endpoints'

const { POST } = method(user)

export const authFetching = {
    login: (body: LoginBody) => {
        return POST<Return<LoginResponse>, LoginBody>('authentication/user-login', body)
    },
    register: (body: RegisterBody) => {
        return POST<Return<RegisterResponse>, RegisterBody>('authentication/user-register', body)
    }
}
