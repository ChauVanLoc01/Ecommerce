import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { EmployeeApi } from 'src/apis/employee.api'
import { EmployeeQuery } from 'src/types/employee.type'
import LayoutProfile from '../Profile/LayoutProfile'
import EmployeeFilter from './EmployeeFilter'
import EmployeeHeader from './EmployeeHeader'
import EmployeeTable from './EmployeeTable'

const Employee = () => {
    const [query, setQuery] = useState<EmployeeQuery>({ limit: import.meta.env.VITE_LIMIT })

    const { data, refetch } = useQuery({
        queryKey: ['employeeList', JSON.stringify(query)],
        queryFn: () => EmployeeApi.getAllEmployee(query),
        placeholderData: (old) => old,
        staleTime: 1000 * 60 * 1,
        enabled: false,
        select: (data) => data.data.result
    })
    const { data: analytics, refetch: analyticsRefetch } = useQuery({
        queryKey: ['employeeAnalytics'],
        queryFn: EmployeeApi.employeeAnalytic,
        placeholderData: (old) => old,
        staleTime: 1000 * 60 * 1,
        enabled: false,
        select: (data) => data.data.result
    })

    useEffect(() => {
        if (Object.keys(query).length > 1) {
            refetch()
        }
    }, [query])

    return (
        <LayoutProfile
            title='Quản lý nhân viên'
            rightNode={
                <EmployeeHeader refetch={refetch} analyticsData={analytics ?? { actives: 0, all: 0, blocks: 0 }} />
            }
        >
            <div className='space-y-5'>
                <EmployeeFilter
                    setQuery={setQuery}
                    pagination={{ page: data?.query.page ?? 0, page_size: data?.query.page_size ?? 0 }}
                />
                <EmployeeTable analyticsRefetch={analyticsRefetch} refetch={refetch} data={data?.data ?? []} />
            </div>
        </LayoutProfile>
    )
}

export default Employee
