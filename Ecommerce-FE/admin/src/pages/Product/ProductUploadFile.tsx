import { CheckIcon, Cross2Icon, DrawingPinIcon, MoveIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { Avatar, Button, Dialog, Flex, IconButton, Inset, Tooltip } from '@radix-ui/themes'
import { isUndefined, omitBy } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { convertToFile } from 'src/utils/utils'

type ProductUploadFileProps = {
    id: string
    setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: File } | undefined>>
    imagePrimary?: string
    setImagePrimary?: React.Dispatch<React.SetStateAction<string | undefined>>
    defaultUrls?: string[]
}

const ProductUploadFile = ({ id, setFiles, imagePrimary, setImagePrimary, defaultUrls }: ProductUploadFileProps) => {
    const [url, setUrl] = useState<string | undefined>(undefined)
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [isShow, setIsShow] = useState<boolean>(false)

    const handleOpen = () => {
        if (fileRef) {
            fileRef.current?.click()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files && files[0]) {
            setFiles((pre) => {
                if (!pre) {
                    return {
                        [(fileRef.current as any).id]: files[0]
                    }
                }
                return omitBy(
                    {
                        ...pre,
                        [(fileRef.current as any).id]: files[0]
                    },
                    isUndefined
                )
            })
            setUrl(URL.createObjectURL(files[0]))
        }
    }

    const handlePrimaryImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setImagePrimary && setImagePrimary(id)
    }

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setFiles((pre) => {
            if (pre) {
                delete pre[id]
                if (!Object.keys(pre).length) {
                    return undefined
                }
                return { ...pre }
            }
            return pre
        })
        setUrl(undefined)
    }

    const handleShow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setIsShow(true)
    }

    useEffect(() => {
        if (defaultUrls) {
            Promise.all(
                defaultUrls.map(async (url, idx) => {
                    let idDefault = `file${idx + 1}`
                    let arr = url.split('/')
                    id === idDefault && setUrl(url)
                    let file = await convertToFile(url, arr[arr.length - 1])
                    return {
                        id: idDefault,
                        file
                    }
                })
            ).then((result) => {
                setFiles(
                    result.reduce((acum, item) => {
                        return {
                            ...acum,
                            [item.id]: item.file
                        }
                    }, {})
                )
            })
        }
    }, [])

    return (
        <>
            <button
                type='button'
                onClick={handleOpen}
                className='w-full relative h-48 border border-gray-400 rounded-8 border-dashed hover:bg-gray-50 cursor-pointer group'
            >
                <Avatar
                    src={url}
                    fallback={<UploadIcon className='w-5 h-5' />}
                    className='w-full h-full object-cover'
                />
                <input ref={fileRef} onChange={handleChange} type='file' id={id} hidden />
                {url && (
                    <Flex className='absolute top-2 right-2 gap-x-1 invisible group-hover:visible'>
                        <Tooltip content='Xem ảnh'>
                            <IconButton
                                className='bg-cyan-600 text-white'
                                color='cyan'
                                size={'1'}
                                type='button'
                                onClick={handleShow}
                            >
                                <MoveIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content='Xóa'>
                            <IconButton className='bg-red text-white' size={'1'} onClick={handleRemove} type='button'>
                                <TrashIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip content={imagePrimary === id ? 'Đang là mặc định' : 'Đặt làm mặc định'}>
                            <IconButton
                                color={imagePrimary === id ? 'blue' : 'crimson'}
                                onClick={handlePrimaryImage}
                                size={'1'}
                                type='button'
                                className='bg-gray-600 text-white'
                            >
                                {imagePrimary === id ? <CheckIcon /> : <DrawingPinIcon />}
                            </IconButton>
                        </Tooltip>
                    </Flex>
                )}
            </button>
            <Dialog.Root open={isShow} onOpenChange={setIsShow}>
                <Dialog.Content className='rounded-8'>
                    <Inset className='relative'>
                        <img src={url} alt='file-upload' className='object-cover w-full h-full' />
                        <Tooltip content='Đóng'>
                            <IconButton
                                className='absolute top-2 right-2 rounded-full'
                                color='red'
                                size={'1'}
                                onClick={() => setIsShow(!isShow)}
                            >
                                <Cross2Icon />
                            </IconButton>
                        </Tooltip>
                    </Inset>
                </Dialog.Content>
            </Dialog.Root>
        </>
    )
}

export default ProductUploadFile
