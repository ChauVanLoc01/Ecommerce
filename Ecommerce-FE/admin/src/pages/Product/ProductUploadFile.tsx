import { MoveIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { Avatar, Flex, IconButton } from '@radix-ui/themes'
import { isUndefined, omitBy } from 'lodash'
import { useRef, useState } from 'react'

type ProductUploadFileProps = {
    id: string
    setFiles: React.Dispatch<React.SetStateAction<{ [key: string]: File } | undefined>>
}

const ProductUploadFile = ({ id, setFiles }: ProductUploadFileProps) => {
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

    return (
        <button
            type='button'
            onClick={handleOpen}
            className='w-full relative h-48 border border-gray-400 rounded-8 border-dashed hover:bg-gray-50 cursor-pointer group'
        >
            <Avatar src={url} fallback={<UploadIcon className='w-5 h-5' />} className='w-full h-full object-cover' />
            <input ref={fileRef} onChange={handleChange} type='file' id={id} hidden />
            {url && (
                <Flex className='absolute top-2 right-2 gap-x-2 invisible group-hover:visible'>
                    <IconButton color='cyan'>
                        <MoveIcon />
                    </IconButton>
                    <IconButton color='red'>
                        <TrashIcon />
                    </IconButton>
                </Flex>
            )}
        </button>
    )
}

export default ProductUploadFile
