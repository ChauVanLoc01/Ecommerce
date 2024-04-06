import { QueryClient } from '@tanstack/react-query'
import { profileFetching } from 'src/apis/profile'

export const profileLoader = async () => {
    const queryClient = new QueryClient()
    const profile = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: profileFetching.getProfile
    })
    return [profile.data.result]
}
