import { QueryClient } from '@tanstack/react-query'
import { LoaderFunction } from 'react-router-dom'
import { profileFetching } from 'src/apis/profile'

const queryClient = new QueryClient()

export const profileLoader: LoaderFunction = async () => {
    const profile = await queryClient.fetchQuery({
        queryKey: ['profile'],
        queryFn: profileFetching.getProfile
    })
    return [profile.data.result]
}
