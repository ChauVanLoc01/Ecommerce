import { AxiosResponse } from 'axios'
import { user } from 'src/constants/endpoints'
import { Delivery, DeliveryBody } from 'src/types/delivery.type'
import { ChangePasswordResponse, ProfileResponse } from 'src/types/profile.type'
import { Return } from 'src/types/return.type'
import { ChangePasswordSchemaType, ProfileSchemaType } from 'src/utils/profile.schema'
import { http } from './http'
import { method } from './method'

const { PUT, GET, POST, DELETE } = method(user)

export const profileFetching = {
    getProfile: () => {
        return GET<Return<ProfileResponse>>('profile/user-profile')
    },
    uploadImage: (formData: FormData) => {
        return http.postForm<Return<string>, AxiosResponse<Return<string>>, FormData>(
            '/store/store/upload-single-file',
            formData
        )
    },
    updateProfile: (body: ProfileSchemaType & { image?: string }) => {
        return PUT<Return<ProfileResponse>, ProfileSchemaType>('profile/user-profile', body)
    },
    changePassword: (body: Omit<ChangePasswordSchemaType, 'confirm_new_password'>) => {
        return PUT<Return<ChangePasswordResponse>, Omit<ChangePasswordSchemaType, 'confirm_new_password'>>(
            'authentication/change-password',
            body
        )
    },
    getDeliveries: () => GET<Return<Delivery[]>>('delivery'),
    createDelivery: (body: DeliveryBody) => POST<Return<Delivery>, DeliveryBody>('delivery', body),
    updateDelivery: (body: Partial<DeliveryBody & { id: string }>) => {
        return PUT<Return<Delivery>, Partial<DeliveryBody & { id: string }>>('delivery', body)
    },
    deleteDelivery: (id: string) => DELETE<Return<{}>>(`delivery/${id}`)
}
