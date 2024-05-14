import axios, { AxiosError, AxiosInstance, AxiosResponse, isAxiosError } from 'axios'
import { loginEvent } from 'src/constants/event.constants'
import { route } from 'src/constants/route'
import { LoginResponse } from 'src/types/auth.type'
import { Return } from 'src/types/return.type'
import { ls } from 'src/utils/localStorage'

class Http {
    private instance: AxiosInstance
    private access_token = ls.getItem('profile')
        ? (JSON.parse(ls.getItem('profile') as string) as LoginResponse).access_token
        : undefined
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_ENDPOINT,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: this.access_token
            }
        })
        this.middlewareRequest()
        this.middlewareResponse()
    }
    getInstanceAxios() {
        return this.instance
    }
    middlewareRequest() {
        this.instance.interceptors.request.use((config) => {
            config.headers.Authorization = this.access_token
            return config
        })
    }
    middlewareResponse() {
        this.instance.interceptors.response.use(
            (response: AxiosResponse<Return<any>>) => {
                const { config, status, data } = response
                if (status === 201 && config.url?.endsWith(route.login)) {
                    this.access_token = (data.result as LoginResponse).access_token
                    ls.setItem('profile', JSON.stringify((data.result as LoginResponse).user))
                    ls.setItem('store', JSON.stringify((data.result as LoginResponse).store))
                    window.dispatchEvent(new Event(loginEvent))
                }
                return response
            },
            (error: AxiosError<{ error: string; message: string; statusCode: number }>) => {
                if (isAxiosError(error)) {
                    if (error.response?.data.error === 'Unauthorized' && error.response.data.statusCode === 401) {
                        document.location.href = '/login'
                    }
                }
            }
        )
    }
}

export const http = new Http().getInstanceAxios()
