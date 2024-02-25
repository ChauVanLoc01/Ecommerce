import classNames from 'classnames'
import SliderLib, { Settings } from 'react-slick'

import './Slider.css'
import Image from 'src/components/Image'

type SliderProps = {
    rootClassName?: string
    data: string[]
}

const Slider = ({ rootClassName, data }: SliderProps) => {
    const settings: Settings = {
        dots: false,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        customPaging: function (i: number) {
            return (
                <button className='w-[70px] h-[70px]'>
                    <img
                        className='w-[70px] h-[70px] object-contain'
                        src={data[i]}
                        alt='img'
                    />
                </button>
            )
        },
        nextArrow: <button>1</button>,
        prevArrow: <button>1</button>
    }
    return (
        <div className={classNames('slider-container', rootClassName)}>
            <SliderLib {...settings}>
                {data.map((e, idx) => (
                    <div key={idx}>
                        <Image
                            className='object-cover'
                            src={e}
                            alt='product-detail-img'
                        />
                    </div>
                ))}
            </SliderLib>
        </div>
    )
}

export default Slider
