import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Dialog, Flex, Spinner, Text, TextArea, TextField } from '@radix-ui/themes'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useContext, useRef, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authFetching } from 'src/apis/authentication'
import { profileFetching } from 'src/apis/profile'
import { exitEvent } from 'src/constants/event'
import { AppContext } from 'src/contexts/AppContext'
import { register_store_schema, RegisterStoreSchemaType } from 'src/utils/store.schema'
import { cn } from 'src/utils/utils.ts'
import { string } from 'yup'

type Props = {
    isMall?: boolean
}

function RegisterStoreForm({ isMall = false }: Props) {
    const { profile } = useContext(AppContext)
    const fileRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const [imgUrl, setImgUrl] = useState<string>('')
    const [isFileError, setIsFileError] = useState<boolean>(false)

    const { mutate, isPending } = useMutation({
        mutationFn: (body: RegisterStoreSchemaType & { image: string }) => authFetching.becomeStore(body),
        onSuccess: () => {
            toast.success('Đăng ký thành công. Bạn cần đăng nhập lại để tiếp tục!')
            window.dispatchEvent(new CustomEvent(exitEvent))
            navigate('/login')
        },
        onError: (err) => {
            if (isAxiosError(err) && err.response?.status === 400) {
                toast.error(err.response.data.message)
            } else {
                toast.error('Có lỗi trong quá trình đăng ký')
            }
        }
    })

    const { mutate: uploadFileMutation, isPending: uploadFilePending } = useMutation({
        mutationFn: profileFetching.uploadImage,
        onSuccess: (e) => {
            setImgUrl(e.data.result)
        },
        onError: () => {
            toast.error('Lỗi cập nhật hình ảnh')
            setImgUrl(profile?.user.image ?? 'https://cdn-icons-png.flaticon.com/512/2202/2202112.png')
        }
    })

    const handleOpenFile = () => {
        fileRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (!e.target.files[0].type.startsWith('image')) {
                toast.error('File không đúng định dạng Image/*')
                return
            }
            if (e.target.files[0].size > 500000) {
                toast.error('Dung lượng hình ảnh tối đa 500KB')
                return
            }
            setImgUrl(URL.createObjectURL(e.target.files[0]))
            setIsFileError(true)
            const formData = new FormData()
            formData.append('file', e.target.files[0])
            uploadFileMutation(formData)
        }
    }

    const { control, handleSubmit } = useForm<RegisterStoreSchemaType>({
        resolver: yupResolver(register_store_schema)
    })

    const onSubmit: SubmitHandler<RegisterStoreSchemaType> = (data) => {
        const urlSchema = string().url().strict()
        const resultValidateImgUrl = urlSchema.isValidSync(imgUrl)
        if (!imgUrl || !resultValidateImgUrl) {
            setIsFileError(true)
            return
        }
        mutate({ ...data, image: imgUrl })
    }
    return (
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
                    name='tax'
                    render={({ field, fieldState: { error } }) => (
                        <div
                            className={cn('space-y-1 hidden', {
                                block: isMall
                            })}
                        >
                            <Flex justify={'between'}>
                                <Text>Mã số thuế</Text>
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
                {imgUrl ? (
                    <button
                        className='w-32 h-32 rounded-full border border-dashed border-blue-600 object-cover mx-auto overflow-hidden relative group'
                        onClick={handleOpenFile}
                    >
                        <img
                            src={imgUrl}
                            alt='background'
                            className='group-hover:opacity-0 transition-all duration-100 ease-linear rounded-full'
                            loading='lazy'
                        />
                        <span className='opacity-0 absolute inset-0 flex justify-center items-center bg-white group-hover:opacity-100 transition-all duration-100 ease-linear rounded-full delay-100'>
                            <AiOutlineCloudUpload size={30} className='w-full hful text-blue-600' />
                        </span>
                        {(isPending || uploadFilePending) && (
                            <div className='bg-gray-100 opacity-60 inset-0 absolute flex justify-center items-center'>
                                <Spinner size={'3'} />
                            </div>
                        )}
                    </button>
                ) : (
                    <button
                        className={cn(
                            'w-32 h-32 rounded-full border border-dashed border-blue-600 object-cover mx-auto overflow-hidden relative group',
                            {
                                'border-red-600': isFileError
                            }
                        )}
                        onClick={handleOpenFile}
                    >
                        <span
                            className={cn('absolute inset-0 flex justify-center items-center bg-white rounded-full', {
                                'flex-col space-y-2': isFileError
                            })}
                        >
                            <AiOutlineCloudUpload
                                size={30}
                                className={cn('w-full hful text-blue-600', {
                                    'text-red-600': isFileError
                                })}
                            />
                            {isFileError && (
                                <Text className='text-red-600 text-xs w-3/4 text-center'>Hình ảnh là bắt buộc</Text>
                            )}
                        </span>
                    </button>
                )}
                <input type='file' ref={fileRef} onChange={handleFileChange} name='' id='' className='hidden' />
            </div>
        </Flex>
    )
}

export default RegisterStoreForm
