import { LoginSchemaType } from 'src/utils/auth.schema'
import { http } from './http'
import { Return } from 'src/types/return.type'
import { LoginResponse } from 'src/types/auth.type'
import { AxiosResponse } from 'axios'

export const AuthAPI = {
    login: (body: LoginSchemaType) => {
        return http.post<Return<LoginResponse>, AxiosResponse<Return<LoginResponse>>, LoginSchemaType>(
            'user/authentication/store-login',
            body
        )
    }
}
