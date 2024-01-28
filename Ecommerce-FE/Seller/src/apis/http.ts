import axios from 'axios'

class Http {
  private instance
  constructor() {
    this.instance = axios.create({
      baseURL: '',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
    this.requestInterceptor()
    this.responseInterceptor()
  }
  getInstanceAxios() {
    return this.instance
  }
  requestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      () => {}
    )
  }
  responseInterceptor() {
    this.instance.interceptors.response.use(
      (response) => {
        return response
      },
      () => {}
    )
  }
}

export const http = new Http().getInstanceAxios()
