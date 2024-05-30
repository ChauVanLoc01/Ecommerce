import { useEffect, useRef, useState } from 'react'

const useStep = () => {
    const [step, setStep] = useState<number>(1)

    const lastStep = useRef<number>(1)

    const handleNextStep = () => step < 3 && setStep(step + 1)

    const handlePreviousStep = (ownStep: number) => () => {
        if (step > ownStep || lastStep.current >= ownStep) setStep(ownStep)
    }

    useEffect(() => {
        if (step > lastStep.current) lastStep.current = step
    }, [step])

    return { step, handleNextStep, handlePreviousStep, setStep }
}

export default useStep
