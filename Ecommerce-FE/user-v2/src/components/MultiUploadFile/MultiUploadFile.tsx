import { ReactNode } from 'react'
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '../Shadcn/carousel'
import UploadFile from '../UpdateFile/UploadFile'

export type MultiUploadFileProps = {
    size?: number
    min: number
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
}

const MultiUploadFile = ({ size = 4, files, min, setFiles, children }: MultiUploadFileProps) => {
    return (
        <div>
            <Carousel className='w-full'>
                <CarouselContent className='gap-x-5 !ml-0'>
                    {Array(size)
                        .fill(0)
                        .map((_, idx) => (
                            <div
                                key={idx}
                                data-size={size}
                                className='data-[size="4"]:basis-1/4 data-[size="5"]:basis-1/5 data-[size="6"]:basis-1/6 last:mr-0 flex-shrink-0'
                            >
                                <UploadFile id={idx} files={files} setFiles={setFiles} key={idx} />
                            </div>
                        ))}
                </CarouselContent>
                <CarouselPrevious type='button' />
                <CarouselNext type='button' />
            </Carousel>
            {children && children(size, files.files.size, Math.min(min, size))}
        </div>
    )
}

export default MultiUploadFile
