import { ReactNode } from 'react'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '../Shadcn/carousel'
import UploadFile from '../UpdateFile/UploadFile'

export type MultiUploadFileProps = {
    size?: number
    min: number
    total?: number
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
    children?: (total: number, current: number, min: number) => ReactNode
    className?: string
}

const MultiUploadFile = ({ total = 10, size = 4, files, min, setFiles, children, className }: MultiUploadFileProps) => {
    return (
        <div>
            <Carousel className='w-full'>
                <CarouselContent className='gap-x-5 !ml-0'>
                    {Array(total)
                        .fill(0)
                        .map((_, idx) => (
                            <div
                                key={idx}
                                data-size={size}
                                className='data-[size="3"]:basis-1/3 data-[size="4"]:basis-1/4 data-[size="5"]:basis-1/5 data-[size="6"]:basis-1/6 last:mr-0 flex-shrink-0'
                            >
                                <UploadFile
                                    id={idx}
                                    files={files}
                                    setFiles={setFiles}
                                    key={idx}
                                    className={className}
                                />
                            </div>
                        ))}
                </CarouselContent>
                <CarouselPrevious type='button' className='text-gray-600' />
                <CarouselNext type='button' className='text-gray-600' />
            </Carousel>
            {children && children(size, files.files.size, Math.min(min, size))}
        </div>
    )
}

export default MultiUploadFile
