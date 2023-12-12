import aixos, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  HttpStatusCode
} from 'axios'
import { toast } from 'react-toastify'
import { PathRoute } from 'src/constants/PathRoute'
import { urlApi } from 'src/constants/config'
import { AthDataResponve } from 'src/types/Ath.type'
import { ResponveApi } from 'src/types/Responve.type'
import { WorkingWithLS } from 'src/utils/LocalStorage'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = WorkingWithLS.getFromLS('access_token') || ''
    this.instance = aixos.create({
      baseURL: urlApi,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = this.accessToken
        }
        return config
      },
      function (error) {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ResponveApi<AthDataResponve>>) => {
        const { url } = response.config
        const { data } = response.data
        if (
          url &&
          [PathRoute.login as string, PathRoute.register as string].includes(
            url
          )
        ) {
          this.accessToken = data.access_token
          WorkingWithLS.saveToLS([
            { key: 'access_token', value: data.access_token || '' },
            { key: 'user', value: JSON.stringify(data.user) || '' }
          ])
        } else if (url === PathRoute.logout) {
          this.accessToken = ''
          WorkingWithLS.clearFromLS(['access_token', 'user'])
        }
        return response
      },
      (error: AxiosError<{ message: string }>) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // toast.error(error.response?.data.message || error.message)
          console.log(error.response?.data.message || error.message)
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          this.accessToken = ''
          WorkingWithLS.clearFromLS(['access_token', 'user'])
        }
        return Promise.reject(error)
      }
    )
  }
}
const http = new Http().instance
export default http
