import { PathRoute } from 'src/constants/PathRoute'
import { AthDataResponve } from 'src/types/Ath.type'
import { ResponveApi } from 'src/types/Responve.type'
import { LoginSchemaType, RegisterSchemaType } from 'src/utils/rules'
import http from './http'

export const AuthFetching = {
  registerFetching: (body: Omit<RegisterSchemaType, 'confirm_password'>) => {
    return http.post<ResponveApi<AthDataResponve>>(PathRoute.register, body)
  },
  LoginFetching: (body: LoginSchemaType) => {
    return http.post<ResponveApi<AthDataResponve>>(PathRoute.login, body)
  },
  LogoutFetching: () => http.post(PathRoute.logout)
}
