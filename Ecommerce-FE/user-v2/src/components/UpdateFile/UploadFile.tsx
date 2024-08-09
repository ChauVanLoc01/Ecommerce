import { CheckIcon, DrawingPinIcon, MoveIcon, TrashIcon, UploadIcon } from '@radix-ui/react-icons'
import { Flex, IconButton, Tooltip } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import { cn } from 'src/utils/utils.ts'

type UploadFileProps = {
    id: number
    files: {
        files: Map<number, File>
        primary?: number
    }
    setFiles: React.Dispatch<
        React.SetStateAction<{
            files: Map<number, File>
            primary?: number
        }>
    >
    className?: string
}

const UploadFile = ({ id, setFiles, files, className }: UploadFileProps) => {
    const [url, setUrl] = useState<string | undefined>(undefined)
    const fileRef = useRef<HTMLInputElement | null>(null)

    let isPrimary = files?.primary ? files.primary : false

    const handleTriggerOpenFile = () => {
        if (fileRef) {
            fileRef.current?.click()
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files
        if (files && files[0]) {
            setFiles((pre) => ({
                ...pre,
                files: pre.files.set(id, files[0])
            }))
            setUrl(URL.createObjectURL(files[0]))
        }
    }

    const handlePrimaryImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        setFiles((pre) => ({
            ...pre,
            primary: id
        }))
    }

    useEffect(() => {
        if (files?.files.has(id)) {
            setUrl(URL.createObjectURL(files.files.get(id) as any))
        }
    }, [])

    return (
        <button
            type='button'
            onClick={handleTriggerOpenFile}
            className={cn(
                'w-full relative h-48 border border-gray-400 rounded-8 border-dashed hover:bg-gray-50 cursor-pointer group overflow-hidden',
                className
            )}
        >
            <div className='relative'>
                {url ? (
                    <img src={url} alt='rating-image' loading='lazy' className='object-fill bg-center' />
                ) : (
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 p-2 rounded-8 overflow-hidden'>
                        <UploadIcon className='size-4' color='gray' />
                    </div>
                )}
            </div>

            <input ref={fileRef} onChange={handleChange} type='file' id={String(id)} hidden />
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
                    <Tooltip content={isPrimary ? 'Đang là mặc định' : 'Đặt làm mặc định'}>
                        <IconButton color={isPrimary ? 'blue' : 'crimson'} onClick={handlePrimaryImage} size={'1'}>
                            {isPrimary ? <CheckIcon /> : <DrawingPinIcon />}
                        </IconButton>
                    </Tooltip>
                </Flex>
            )}
        </button>
    )
}

export default UploadFile
