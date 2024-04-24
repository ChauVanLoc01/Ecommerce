import { LoginBody, LoginResponse, RegisterBody, RegisterResponse, RegisterStoreResponse } from 'src/types/auth.type'
import { method } from './method'
import { Return } from 'src/types/return.type'
import { user } from 'src/constants/endpoints'
import { RegisterStoreSchemaType } from 'src/utils/store.schema'
import { http } from './http'
import { AxiosResponse } from 'axios'

const { POST } = method(user)

export const authFetching = {
    login: (body: LoginBody) => {
        return POST<Return<LoginResponse>, LoginBody>('authentication/user-login', body)
    },
    register: (body: RegisterBody) => {
        return POST<Return<RegisterResponse>, RegisterBody>('authentication/user-register', body)
    },
    becomeStore: (body: RegisterStoreSchemaType & { image: string }) => {
        return http.post<RegisterStoreResponse, AxiosResponse<RegisterStoreResponse>, RegisterStoreSchemaType>(
            'store/store/register',
            body
        )
    }
}
