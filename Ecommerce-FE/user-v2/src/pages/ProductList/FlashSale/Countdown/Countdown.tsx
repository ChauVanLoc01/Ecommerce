/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'

import Digits from './Digits'

const Countdown = ({ targetTime }: any) => {
    const [now, setNow] = useState(new Date().getTime())
    useEffect(() => {
        const interval = setInterval(() => setNow(new Date().getTime()), 1000)
        return () => clearInterval(interval)
    }, [])
    const millisecs = targetTime.getTime() - now
    const days = Math.floor(millisecs / (1000 * 3600 * 24))
    let remainingMs = millisecs - days * 1000 * 3600 * 24
    const hours = Math.floor(remainingMs / (1000 * 3600))
    remainingMs -= hours * 3600 * 1000
    const minutes = Math.floor(remainingMs / (1000 * 60))
    remainingMs -= minutes * 1000 * 60
    const seconds = Math.floor(remainingMs / 1000)
    return (
        <div className='flex space-x-1'>
            <Digits value={hours} />
            <Digits value={minutes} />
            <Digits value={seconds} />
        </div>
    )
}

export default Countdown
