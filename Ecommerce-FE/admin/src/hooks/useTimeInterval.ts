import { useState } from 'react'
import { timeInterval } from 'src/utils/utils'

const useTimeInterval: () => [
    string[],
    string,
    (idx: number) => () => void,
    React.Dispatch<React.SetStateAction<string[]>>
] = () => {
    const { dayInterval, monthInterval, weekInterval } = timeInterval()

    const times = [dayInterval, weekInterval, monthInterval]
    const formats = ['dd', 'cc', 'MM']

    const [time, setTime] = useState<string[]>(times[0])

    const [format, setFormat] = useState<string>(formats[0])

    const handleSelect = (idx: number) => () => {
        setTime(times[idx - 1])
        setFormat(format[idx - 1])
    }

    return [time, format, handleSelect, setTime]
}

export default useTimeInterval
