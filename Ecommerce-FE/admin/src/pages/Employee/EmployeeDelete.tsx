import { AlertDialog, Button, Flex, Spinner } from '@radix-ui/themes'
import { QueryObserverResult, RefetchOptions, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { EmployeeApi } from 'src/apis/employee.api'
import { EmployeeList, EmployeeQuery } from 'src/types/employee.type'

type EmployeeDeleteProps = {
    status: string
    employeeId: string
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    analyticsRefetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                all: number
                actives: number
                blocks: number
            },
            Error
        >
    >
    refetch: (options?: RefetchOptions) => Promise<
        QueryObserverResult<
            {
                data: EmployeeList[]
                query: Omit<EmployeeQuery, 'page'> & {
                    page_size: number
                    page: number
                }
            },
            Error
        >
    >
}

const EmployeeDelete = ({ employeeId, open, setOpen, refetch, status, analyticsRefetch }: EmployeeDeleteProps) => {
    const content: {
        [key: string]: { title: string; description: string; error_message: string; success_message: string }
    } = {
        ACTIVE: {
            title: 'Xóa nhân viên',
            description:
                'Bạn có chắc chắn muốn xóa nhân viên này? Bạn vẫn sẽ khôi phục được sau khi thực hiện hành động này',
            error_message: 'Lỗi! Khóa nhân viên không thành công',
            success_message: 'Khóa nhân viên thành công'
        },
        BLOCK: {
            title: 'Mở khóa nhân viên',
            description:
                'Bạn có chắc chắn muốn mở khóa nhân viên này? Bạn vẫn sẽ khóa được sau khi thực hiện hành động này',
            error_message: 'Lỗi! Mở khóa nhân viên không thành công',
            success_message: 'Mở khóa nhân viên thành công'
        }
    }

    const { mutate, isPending } = useMutation({
        mutationFn: EmployeeApi.blockEmployee,
        onSuccess: () => {
            refetch()
            analyticsRefetch()
            setOpen(false)
            setTimeout(() => {
                toast.success(content[status].success_message)
            }, 500)
        },
        onError: () => {
            toast.error(content[status].error_message)
        }
    })

    const handleBlock = () => mutate({ employeeId, status: status === 'ACTIVE' ? 'BLOCK' : 'ACTIVE' })

    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content maxWidth='450px' className='!rounded-8'>
                <AlertDialog.Title>{content[status].title}</AlertDialog.Title>
                <AlertDialog.Description size='2'>{content[status].description}</AlertDialog.Description>
                <Flex gap='3' mt='4' justify='end'>
                    <AlertDialog.Cancel>
                        <Button variant='outline' color='red'>
                            Hủy
                        </Button>
                    </AlertDialog.Cancel>
                    <Button onClick={handleBlock}>{isPending && <Spinner />} Xác nhận</Button>
                </Flex>
            </AlertDialog.Content>
        </AlertDialog.Root>
    )
}

export default EmployeeDelete
