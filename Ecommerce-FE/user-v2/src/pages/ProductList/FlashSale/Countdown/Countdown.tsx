import { useEffect, useState } from 'react'

import { add, endOfHour, startOfHour } from 'date-fns'
import Digits from './Digits'

type CountDownProps = {
    targetTime?: Date
}

const Countdown = ({ targetTime = add(endOfHour(new Date()), { hours: 7 }) }: CountDownProps) => {
    const [now, setNow] = useState(add(startOfHour(new Date()), { hours: 7 }).getTime())
    useEffect(() => {
        const interval = setInterval(() => setNow(add(new Date(), { hours: 7 }).getTime()), 1000)
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
