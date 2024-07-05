import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

const useStep = () => {
    const [step, setStep] = useState<number>(1)

    const lastStep = useRef<number>(1)

    const handleNextStep = (isOk: boolean) => () => {
        if (isOk) {
            step < 3 && setStep(step + 1)
            return
        }
        toast.warning(
            [
                'Cần chọn sản phẩm để có thể tiếp tục',
                'Thông tin vận chuyển không được trống',
                'Phương thức thanh toán là bắt buộc'
            ][step - 1]
        )
    }

    const handlePreviousStep = (ownStep: number) => () => {
        if (step > ownStep || lastStep.current >= ownStep) setStep(ownStep)
    }

    useEffect(() => {
        if (step > lastStep.current) lastStep.current = step
    }, [step])

    return { step, handleNextStep, handlePreviousStep, setStep }
}

export default useStep
