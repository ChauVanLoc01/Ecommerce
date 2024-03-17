import axios, { AxiosInstance } from 'axios'

class Http {
    private instance: AxiosInstance
    constructor() {
        this.instance = axios.create({
            baseURL: import.meta.env.VITE_ENDPOINT,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
        // this.requestInterceptor()
        // this.responseInterceptor()
    }
    getInstanceAxios() {
        return this.instance
    }
    middlewareRequest() {
        this.instance.interceptors.request.use(
            (config) => {
                return config
            },
            () => {}
        )
    }
    middlewareResponse() {
        this.instance.interceptors.response.use(
            (response) => {
                return response
            },
            () => {}
        )
    }
}

export const http = new Http().getInstanceAxios()
