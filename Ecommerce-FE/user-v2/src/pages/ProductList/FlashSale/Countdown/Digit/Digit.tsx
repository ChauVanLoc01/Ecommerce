import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'

type DigitProps = {
    value: any
    digitClassName?: string
}

const Digit = ({ value, digitClassName }: DigitProps) => {
    return (
        <div style={{ width: 20, height: 20 }}>
            <AnimatePresence>
                <motion.div
                    key={value}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{
                        times: [0.2, 0.2, 0.45],
                        ease: 'linear'
                    }}
                    className={classNames('absolute text-white text-sm font-semibold', digitClassName)}
                >
                    {value}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Digit
