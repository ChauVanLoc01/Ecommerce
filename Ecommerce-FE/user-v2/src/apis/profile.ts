import { user } from 'src/constants/endpoints'
import { ChangePasswordResponse, ProfileResponse } from 'src/types/profile.type'
import { Return } from 'src/types/return.type'
import { ChangePasswordSchemaType, ProfileSchemaType } from 'src/utils/profile.schema'
import { method } from './method'

const { PUT, GET } = method(user)

export const profileFetching = {
    getProfile: () => {
        return GET<Return<ProfileResponse>>('profile')
    },
    updateProfile: (body: ProfileSchemaType) => {
        return PUT<Return<ProfileResponse>, ProfileSchemaType>('profile', body)
    },
    changePassword: (body: Omit<ChangePasswordSchemaType, 'confirm_new_password'>) => {
        return PUT<Return<ChangePasswordResponse>, Omit<ChangePasswordSchemaType, 'confirm_new_password'>>(
            'authentication/change-password',
            body
        )
    }
}
