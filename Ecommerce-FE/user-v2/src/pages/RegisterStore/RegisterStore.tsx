import { Button, Dialog, SegmentedControl } from '@radix-ui/themes'
import { ReactNode, useContext, useState } from 'react'
import { AppContext } from 'src/contexts/AppContext'
import RegisterStoreForm from './RegisterStoreForm'

const RegisterStore = () => {
    const { profile } = useContext(AppContext)
    const [open, setOpen] = useState<boolean>(false)
    const [type, setType] = useState<string>('normal')

    let form: Record<string, ReactNode> = {
        normal: <RegisterStoreForm />,
        mall: <RegisterStoreForm isMall />
    }

    const handleChangeType = (value: string) => setType(value)

    return (
        <>
            {!profile?.user?.storeRoleId ? (
                <Dialog.Root open={open} onOpenChange={setOpen}>
                    <Dialog.Trigger>
                        <Button variant='outline' color='red'>
                            Đăng ký bán hàng
                        </Button>
                    </Dialog.Trigger>
                    <Dialog.Content size={'4'} className='!rounded-12'>
                        <Dialog.Title>Đăng ký bán hàng</Dialog.Title>
                        <Dialog.Description size='2' mb='4'>
                            Đồng hành cùng Shop để trở thành nhà bán lẻ số 1
                        </Dialog.Description>
                        <SegmentedControl.Root defaultValue={type} size={'3'} onValueChange={handleChangeType}>
                            <SegmentedControl.Item value='normal'>Nhà bán lẻ</SegmentedControl.Item>
                            <SegmentedControl.Item value='mall'>Shop Mall</SegmentedControl.Item>
                        </SegmentedControl.Root>
                        <div className='pt-5'>{form[type]}</div>
                    </Dialog.Content>
                </Dialog.Root>
            ) : (
                <Button variant='outline' color='tomato'>
                    Đến cửa hàng
                </Button>
            )}
        </>
    )
}

export default RegisterStore
