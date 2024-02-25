import { useState } from 'react'

import { motion } from 'framer-motion'

const hiddenMask = `repeating-linear-gradient(to top, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 50px, rgba(0,0,0,1) 50px, rgba(0,0,0,1) 50px)`
const visibleMask = `repeating-linear-gradient(to top, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 0px, rgba(0,0,0,1) 50px)`

type ImageProps = {
    rootClassName?: string
} & React.ImgHTMLAttributes<HTMLImageElement>

const Image = ({ rootClassName, src, alt, ...rest }: ImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(false)

    return (
        <motion.section
            initial={false}
            animate={
                isLoaded && isInView
                    ? {
                          WebkitMaskImage: visibleMask,
                          maskImage: visibleMask
                      }
                    : { WebkitMaskImage: hiddenMask, maskImage: hiddenMask }
            }
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            onViewportEnter={() => setIsInView(true)}
            className={rootClassName}
        >
            <img
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)}
                {...rest}
            />
        </motion.section>
    )
}

export default Image
