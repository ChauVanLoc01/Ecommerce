import { CheckIcon, DrawingPinIcon, MoveIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { Avatar, Flex, IconButton, Tooltip } from '@radix-ui/themes'
import { isUndefined, omitBy } from 'lodash'
import { useRef, useState } from 'react'

type ProductUploadFileProps = {
    id: string
    setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: File } | undefined>>
    imagePrimary: string | undefined
    setImagePrimary: React.Dispatch<React.SetStateAction<string | undefined>>
}

const ProductUploadFile = ({ id, setFiles, imagePrimary, setImagePrimary }: ProductUploadFileProps) => {
    const [url, setUrl] = useState<string | undefined>(undefined)
    const fileRef = useRef<HTMLInputElement | null>(null)

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
        setImagePrimary(id)
    }

    return (
        <button
            type='button'
            onClick={handleOpen}
            className='w-full relative h-48 border border-gray-400 rounded-8 border-dashed hover:bg-gray-50 cursor-pointer group'
        >
            <Avatar src={url} fallback={<UploadIcon className='w-5 h-5' />} className='w-full h-full object-cover' />
            <input ref={fileRef} onChange={handleChange} type='file' id={id} hidden />
            {url && (
                <Flex className='absolute top-2 right-2 gap-x-1 invisible group-hover:visible'>
                    <Tooltip content='Xem ảnh'>
                        <IconButton color='cyan' size={'1'}>
                            <MoveIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content='Xóa'>
                        <IconButton color='red' size={'1'}>
                            <TrashIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip content={imagePrimary === id ? 'Đang là mặc định' : 'Đặt làm mặc định'}>
                        <IconButton
                            color={imagePrimary === id ? 'blue' : 'crimson'}
                            onClick={handlePrimaryImage}
                            size={'1'}
                        >
                            {imagePrimary === id ? <CheckIcon /> : <DrawingPinIcon />}
                        </IconButton>
                    </Tooltip>
                </Flex>
            )}
        </button>
    )
}

export default ProductUploadFile
