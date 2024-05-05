import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from 'src/components/Shadcn/carousel'
import { Product } from 'src/types/product.type'

type HomeProps = {
    programs: Product[]
}

const Home = ({ programs }: HomeProps) => {
    return (
        <div>
            <Carousel>
                <CarouselContent>
                    {programs.map((program) => (
                        <CarouselItem className='basis-1/6'>{program.name}</CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default Home
