import { Select } from '@radix-ui/themes'
import { analytics, AnalyticType } from 'src/types/analytics.type'

type AnalyticSelectProps = {
    setAnalyticType: React.Dispatch<React.SetStateAction<AnalyticType>>
}

const AnalyticSelect = ({ setAnalyticType }: AnalyticSelectProps) => {
    const handleSelect = (value: AnalyticType) => {
        setAnalyticType(value)
    }
    return (
        <Select.Root defaultValue={analytics[0].key} size={'2'} onValueChange={handleSelect}>
            <Select.Trigger />
            <Select.Content position='popper' align='end' className='rounded-8'>
                {analytics.map(({ key, label }) => (
                    <Select.Item value={key}>{label}</Select.Item>
                ))}
            </Select.Content>
        </Select.Root>
    )
}

export default AnalyticSelect
