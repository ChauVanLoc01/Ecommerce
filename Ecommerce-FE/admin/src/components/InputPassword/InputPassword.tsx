import { useState } from 'react'

import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'

import Input from '../Input'

const InputPassword = () => {
    const [hidden, setHidden] = useState<boolean>(false)

    return (
        <Input
            type={hidden ? 'password' : 'text'}
            iconRight={
                <button
                    type='button'
                    onClick={() => setHidden((preState) => !preState)}
                >
                    {!hidden ? (
                        <AiOutlineEyeInvisible color='rgb(91, 107, 121)' />
                    ) : (
                        <AiOutlineEye color='rgb(91, 107, 121)' />
                    )}
                </button>
            }
        />
    )
}

export default InputPassword
