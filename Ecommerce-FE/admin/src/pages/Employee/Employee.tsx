import LayoutProfile from '../Profile/LayoutProfile'
import EmployeeFilter from './EmployeeFilter'
import EmployeeHeader from './EmployeeHeader'
import EmployeeTable from './EmployeeTable'

const Employee = () => {
    return (
        <LayoutProfile title='Quản lý nhân viên' rightNode={<EmployeeHeader />}>
            <div className='space-y-5'>
                <EmployeeFilter />
                <EmployeeTable />
            </div>
        </LayoutProfile>
    )
}

export default Employee
