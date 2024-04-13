import Slider from 'react-slick'
import useIdHook from 'src/hooks/useIdHook'

type SlickPagingType = {
  data: string[]
}

function SlickPaging({ data }: SlickPagingType) {
  const id = useIdHook()
  const settings = {
    customPaging: function (i: number) {
      return (
        <>
          <img src={data[i]} className='mx-3 h-[100px]' />
        </>
      )
    },
    dots: true,
    dotsClass: 'slick-dots slick-thumb',
    appendDots: (dots: JSX.Element) => <div className='flex'></div>,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  return (
    <div className='flex w-[40%] flex-col py-3 pl-3'>
      <Slider {...settings}>
        {data.map((_, i) => (
          <>
            <img className='mb-3 w-full' key={id} src={data[i]} alt={id} />
          </>
        ))}
      </Slider>
    </div>
  )
}

export default SlickPaging
