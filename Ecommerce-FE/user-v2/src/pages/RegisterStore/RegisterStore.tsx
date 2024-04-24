import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, Flex, Spinner, Text, TextArea, TextField } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { toast } from 'sonner'
import { authFetching } from 'src/apis/authentication'
import { register_store_schema, RegisterStoreSchemaType } from 'src/utils/store.schema'

const RegisterStore = () => {
    const [open, setOpen] = useState<boolean>(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const { mutate, isPending } = useMutation({
        mutationFn: (body: RegisterStoreSchemaType & { image: string }) => authFetching.becomeStore(body),
        onSuccess: () => {
            toast.success('Đăng ký thành công')
        },
        onError: (err) => {
            if (isAxiosError(err) && err.response?.status === 400) {
                toast.error(err.response.data.message)
            } else {
                toast.error('Có lỗi trong quá trình đăng ký')
            }
        }
    })

    const { control, handleSubmit } = useForm<RegisterStoreSchemaType>({
        resolver: yupResolver(register_store_schema)
    })

    const handleOpenFile = () => {
        fileRef.current?.click()
    }

    const onSubmit: SubmitHandler<RegisterStoreSchemaType> = (data) =>
        mutate({ ...data, image: 'https://i.pinimg.com/564x/2a/78/2e/2a782eaf78e7cd78aa94961cb18d7786.jpg' })

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button variant='outline' color='red'>
                    Trở thành nhà bán lẻ
                </Button>
            </Dialog.Trigger>
            <Dialog.Content size={'4'} className='!rounded-12'>
                <Dialog.Title>Đăng ký trở thành nhà bán lẻ</Dialog.Title>
                <Dialog.Description size='2' mb='4'>
                    Đồng hành cùng Shop để trở thành nhà bán lẻ số 1
                </Dialog.Description>
                <Flex justify={'between'} gapX={'8'}>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 basis-3/5'>
                        <Controller
                            control={control}
                            name='name'
                            render={({ field, fieldState: { error } }) => (
                                <div className='space-y-1'>
                                    <Flex justify={'between'}>
                                        <Text>Tên cửa hàng</Text>
                                        {error && <Text color='red'>{error.message}</Text>}
                                    </Flex>
                                    <TextField.Root {...field} size={'3'} className='flex-grow' />
                                </div>
                            )}
                        />
                        <Controller
                            control={control}
                            name='location'
                            render={({ field, fieldState: { error } }) => (
                                <div className='space-y-1'>
                                    <Flex justify={'between'}>
                                        <Text>Địa chỉ</Text>
                                        {error && <Text color='red'>{error.message}</Text>}
                                    </Flex>
                                    <TextArea {...field} size={'3'} className='flex-grow' />
                                </div>
                            )}
                        />
                        <Flex gapX={'3'} justify={'end'}>
                            <Dialog.Close>
                                <Button color='red' type='button' variant='outline'>
                                    Hủy
                                </Button>
                            </Dialog.Close>
                            <Button type='submit'>
                                {isPending && <Spinner />}
                                Xác nhận
                            </Button>
                        </Flex>
                    </form>
                    <div>
                        <button
                            className='w-32 h-32 rounded-full border border-dashed border-blue-600 object-cover mx-auto overflow-hidden relative group'
                            onClick={handleOpenFile}
                        >
                            <img
                                src='https://cdn-icons-png.flaticon.com/512/2202/2202112.png'
                                alt='background'
                                className='group-hover:opacity-0 transition-all duration-100 ease-linear rounded-full'
                            />
                            <span className='opacity-0 absolute inset-0 flex justify-center items-center bg-white group-hover:opacity-100 transition-all duration-100 ease-linear rounded-full delay-100'>
                                <AiOutlineCloudUpload size={30} className='w-full hful text-blue-600' />
                            </span>
                        </button>
                        <input type='file' ref={fileRef} name='' id='' className='hidden' />
                    </div>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default RegisterStore
