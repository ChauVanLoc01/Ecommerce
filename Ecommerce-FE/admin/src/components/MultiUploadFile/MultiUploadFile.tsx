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
    cols?: number
}

const MultiUploadFile = ({ size = 5, files, min, setFiles, children, cols = 4 }: MultiUploadFileProps) => {
    return (
        <div>
            <Carousel className='w-full'>
                <CarouselContent>
                    {Array(size)
                        .fill(0)
                        .map((_, idx) => (
                            <div
                                key={idx}
                                data-cols={cols}
                                className='mr-5 last:mr-0 flex-shrink-0 data-[cols="2"]:basis-1/2 data-[cols="3"]:basis-1/3 data-[cols="4"]:basis-1/4 data-[cols="5"]:basis-1/5 data-[cols="6"]:basis-1/6'
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
