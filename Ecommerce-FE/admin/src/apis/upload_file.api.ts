import { Return } from 'src/types/return.type'
import { http } from './http'

export const UploadApi = {
    updateSingleFile: (formData: FormData) => {
        return http.postForm<Return<string>>('/store/store/upload-single-file', formData)
    },
    updateMultipleFile: (formData: FormData) => {
        return http.postForm<Return<string[]>>('/store/store/upload-multiple-file', formData)
    }
}
