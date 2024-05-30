import { profileFetching } from 'src/apis/profile'
import { queryClient } from 'src/routes/main.route'
import { loadingEvent } from 'src/utils/utils.ts'

export const profileLoader = async () => {
    loadingEvent.start(true)

    const profile = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: profileFetching.getProfile
    })

    loadingEvent.end()

    return [profile.data.result]
}
