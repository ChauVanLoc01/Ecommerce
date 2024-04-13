import { user } from 'src/constants/endpoints'
import { ChangePasswordResponse, ProfileResponse } from 'src/types/profile.type'
import { Return } from 'src/types/return.type'
import { ChangePasswordSchemaType, ProfileSchemaType } from 'src/utils/profile.schema'
import { method } from './method'
import { Delivery, DeliveryBody } from 'src/types/delivery.type'

const { PUT, GET, POST, DELETE } = method(user)

export const profileFetching = {
    getProfile: () => {
        return GET<Return<ProfileResponse>>('profile/user-profile')
    },
    updateProfile: (body: ProfileSchemaType) => {
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
