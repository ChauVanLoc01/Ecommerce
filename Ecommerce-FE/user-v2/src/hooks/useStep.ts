import { useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { AppContext } from 'src/contexts/AppContext'

const useStep = () => {
    const { ids } = useContext(AppContext)
    const [step, setStep] = useState<number>(1)

    const lastStep = useRef<number>(1)

    const handleNextStep = () => {
        if (ids?.checked_productIds.length) {
            step < 3 && setStep(step + 1)
            return
        }
        toast.warning(
            [
                'Chọn sản phẩm để tiếp tục',
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
