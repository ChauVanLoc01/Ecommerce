import { useState } from 'react'

import { motion } from 'framer-motion'
import classNames from 'classnames'

type ImageProps = {
    rootClassName?: string
    overlay?: boolean
} & React.ImgHTMLAttributes<HTMLImageElement>

const Image = ({ rootClassName, src, alt, overlay, ...rest }: ImageProps) => {
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
            className={classNames(rootClassName, 'relative')}
        >
            <img src={src} alt={alt} onLoad={() => setIsLoaded(true)} {...rest} />
            <div
                className={classNames('absolute inset-0 bg-gray-700/50 rounded-12', {
                    hidden: !overlay
                })}
            />
        </motion.section>
    )
}

export default Image
