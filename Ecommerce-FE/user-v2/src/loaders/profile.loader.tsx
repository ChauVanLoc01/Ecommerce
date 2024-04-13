import { profileFetching } from 'src/apis/profile'
import { queryClient } from 'src/routes/main.route'

export const profileLoader = async () => {
    const profile = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: profileFetching.getProfile
    })
    return [profile.data.result]
}
