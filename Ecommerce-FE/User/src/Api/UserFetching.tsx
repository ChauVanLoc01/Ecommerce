import { ResponveApi } from 'src/types/Responve.type'
import http from './http'
import { PathRoute } from 'src/constants/PathRoute'
import { User } from 'src/types/User'

export const UserFetching = {
  GetUserFetching: () => {
    return http.get<ResponveApi<User>>('/me')
  },
  UpdateFetching: (body: Partial<User>) => {
    return http.put<ResponveApi<User>>(PathRoute.user, body)
  },
  updateAvatar: (body: FormData) => {
    return http.post<ResponveApi<string>>(
      `${PathRoute.user}/${PathRoute.uploadAvatar}`,
      body,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )
  }
}
