import { useState } from 'react'

import { motion } from 'framer-motion'

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
                          opacity: 1
                      }
                    : { opacity: 0 }
            }
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            onViewportEnter={() => setIsInView(true)}
            className={rootClassName}
        >
            <img src={src} alt={alt} onLoad={() => setIsLoaded(true)} {...rest} />
        </motion.section>
    )
}

export default Image
