import { useState } from 'react'
import { AnalyticType } from 'src/types/analytics.type'

const useAnalytic = (defaultValue?: AnalyticType) => {
    const [type, setType] = useState<AnalyticType>(defaultValue || 'day')
    return {
        type,
        setType
    }
}

export default useAnalytic
