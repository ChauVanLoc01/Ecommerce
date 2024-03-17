import { AxiosRequestConfig, AxiosResponse } from 'axios'

import { http } from './http'

const apiEndpoint = import.meta.env.VITE_ENDPOINT

export const method = (serviceEnpoint: string) => {
    return {
        GET<DataResponse, Params = any>(
            url: string,
            params?: Params,
            config?: Omit<AxiosRequestConfig<any>, 'params' | 'data'>
        ) {
            return http.get<DataResponse>(`${apiEndpoint}${serviceEnpoint}/${url}`, { ...config, params })
        },
        POST<DataResponse, Body>(url: string, body: Body, config?: Omit<AxiosRequestConfig<Body>, 'params' | 'data'>) {
            return http.post<DataResponse, AxiosResponse<DataResponse>, Body>(
                `${apiEndpoint}${serviceEnpoint}/${url}`,
                body,
                config
            )
        },
        POST_WITH_FORM_DATA<DataResponse>(
            url: string,
            body: FormData,
            config?: Omit<AxiosRequestConfig<FormData>, 'params' | 'data'>
        ) {
            return http.post<DataResponse, AxiosResponse<DataResponse>, FormData>(
                `${apiEndpoint}${serviceEnpoint}/${url}`,
                body,
                {
                    ...config,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
        },
        PUT<DataResponse, Body>(url: string, body: Body, config?: Omit<AxiosRequestConfig<Body>, 'params' | 'data'>) {
            return http.put<DataResponse, AxiosResponse<DataResponse>, Body>(
                `${apiEndpoint}${serviceEnpoint}/${url}`,
                body,
                config
            )
        },
        PUT_WITH_FORM_DATA<DataResponse>(
            url: string,
            body: FormData,
            config?: Omit<AxiosRequestConfig<FormData>, 'params' | 'data'>
        ) {
            return http.put<DataResponse, AxiosResponse<DataResponse>, FormData>(
                `${apiEndpoint}${serviceEnpoint}/${url}`,
                body,
                {
                    ...config,
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
        },
        DELETE<DataResponse>(url: string, config?: Omit<AxiosRequestConfig<any>, 'params' | 'data'>) {
            return http.delete<DataResponse>(`${apiEndpoint}${serviceEnpoint}/${url}`, config)
        }
    }
}
