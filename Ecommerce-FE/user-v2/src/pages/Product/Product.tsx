import SimpleBar from 'simplebar-react'

import Button from 'src/components/Button'
import InputNumber from 'src/components/InputNumber'
import Stars from 'src/components/Stars'

import MaybeULike from './MaybeULike'
import Review from './Review'
import Slider from './Slider'

const Product = () => {
    return (
        <div className='space-y-4 pb-20'>
            <section className='flex gap-10'>
                <Slider
                    rootClassName='basis-2/5 max-w-[40%] grow-0 bg-[#FFFFFF] rounded-12'
                    data={[
                        'https://ableproadmin.com/react/static/media/prod-5.51c518a97f9ee4861176.png',
                        'https://ableproadmin.com/react/static/media/prod-8.7d6a537de6b76b3f24af.png',
                        'https://ableproadmin.com/react/static/media/prod-7.52a181a85299b37cf5ea.png'
                    ]}
                />
                <div className='space-y-3'>
                    <Stars amount={3} />
                    <h3 className='font-semibold text-2xl tracking-wider'>
                        Canon EOS 1500D 24.1 Digital SLR
                    </h3>
                    <p className='tracking-wider leading-5'>
                        Image Enlargement: After shooting, you can enlarge
                        photographs of the objects for clear zoomed view. Change
                        In Aspect Ratio: Boldly crop the subject and save it
                        with a composition that has impact. You can convert it
                        to a 1:1 square format, and after shooting you can
                        create a photo that will be popular on SNS.
                    </p>
                    <InputNumber />
                    <div className='space-x-3 text-xl'>
                        <span className=''>$12.99</span>
                        <span className='line-through text-gray-400'>
                            $15.99
                        </span>
                    </div>
                    <div className='flex justify-start gap-3'>
                        <Button
                            className='w-fit bg-red-600 hover:bg-red-700'
                            text='Mua ngay'
                        />
                        <Button className='w-fit' text='Thêm vào giỏ hàng' />
                    </div>
                </div>
            </section>
            <div className='flex gap-4'>
                <section className='bg-[#FFFFFF] rounded-12 border border-border/30 p-[24px] basis-1/2 space-y-4 sticky top-0'>
                    <div className='rounded-12 border border-border/30 p-[24px] flex'>
                        <div className='basis-1/3 space-y-2'>
                            <div className='space-x-2 text-2xl relative'>
                                <span className='font-semibold'>4</span>
                                <span className='text-lg absolute top-1/2 -translate-y-1/2 text-gray-500'>
                                    /5
                                </span>
                            </div>
                            <h3 className='tracking-wide'>
                                Dựa trên 13 đánh giá
                            </h3>
                            <Stars amount={4} />
                        </div>
                    </div>
                    <SimpleBar style={{ maxHeight: 708 }}>
                        <div className='space-y-4'>
                            <Review />
                            <Review />
                            <Review />
                            <Review />
                            <Review />
                            <Review />
                        </div>
                    </SimpleBar>
                </section>
                <section className='bg-[#FFFFFF] rounded-12 border border-border/30 basis-1/2 sticky top-0'>
                    <div className='border-b border-border/30 p-[24px]'>
                        <h3 className='text-base font-semibold tracking-wide'>
                            Có thể bạn sẽ thích
                        </h3>
                    </div>
                    <SimpleBar style={{ maxHeight: 810 }}>
                        <div className='divide-y divide-border/30'>
                            <MaybeULike />
                            <MaybeULike />
                            <MaybeULike />
                            <MaybeULike />
                            <MaybeULike />
                            <MaybeULike />
                            <MaybeULike />
                            <MaybeULike />
                        </div>
                    </SimpleBar>
                </section>
            </div>
        </div>
    )
}

export default Product
