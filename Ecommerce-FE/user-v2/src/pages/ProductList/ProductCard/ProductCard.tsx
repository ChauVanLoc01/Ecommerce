import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import Button from 'src/components/Button'
import Image from 'src/components/Image'
import Stars from 'src/components/Stars'

const ProductCard = () => {
    return (
        <motion.article
            className='rounded-12 border border-border/30 bg-[#FFFFFF] hover:shadow-md'
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <Link to={'/aaa'} className='border-b border-border/30'>
                <Image
                    src='https://ableproadmin.com/react/static/media/prod-5.51c518a97f9ee4861176.png'
                    alt='product-img'
                    className='object-cover'
                />
            </Link>
            <div className='p-[16px] space-y-4'>
                <div className='space-y-1'>
                    <Link
                        to={'/'}
                        className='font-semibold text-base tracking-wide'
                    >
                        Canon EOS 1500D 24.1 Digital SLR
                    </Link>
                    <h4 className='tracking-wide'>Cannon</h4>
                </div>
                <div className='flex justify-between items-end'>
                    <div>
                        <h3 className='space-x-2 text-base'>
                            <span className='font-semibold'>$29.99</span>
                            <span className='line-through text-gray-400'>
                                $29.99
                            </span>
                        </h3>
                        <Stars amount={5} />
                    </div>
                    <div>
                        <Button className='px-5 py-[10px] text-xs' text='Add' />
                    </div>
                </div>
            </div>
        </motion.article>
    )
}

export default ProductCard
