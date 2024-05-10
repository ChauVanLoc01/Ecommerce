import { LoaderFunction } from 'react-router-dom'
import { EmployeeApi } from 'src/apis/employee.api'
import { loadingFetchingEvent } from 'src/constants/event.constants'
import { queryClient } from 'src/routes/main.route'

export const employeeLoader: LoaderFunction = async () => {
    window.dispatchEvent(new Event(loadingFetchingEvent.start))

    await Promise.all([
        queryClient.fetchQuery({
            queryKey: ['employeeList', JSON.stringify({ limit: import.meta.env.VITE_LIMIT })],
            queryFn: () => EmployeeApi.getAllEmployee({ limit: import.meta.env.VITE_LIMIT }),
            staleTime: 1000 * 60 * 1
        }),
        queryClient.fetchQuery({
            queryKey: ['employeeAnalytics'],
            queryFn: EmployeeApi.employeeAnalytic,
            staleTime: 1000 * 60 * 1
        })
    ])

    window.dispatchEvent(new Event(loadingFetchingEvent.end))

    return []
}
