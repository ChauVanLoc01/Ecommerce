import { useState } from 'react'

import { PiEyeLight, PiEyeSlashLight } from 'react-icons/pi'

import InputIcon from '../InputIcon'

const InputPassword = () => {
    const [hidden, setHidden] = useState<boolean>(true)

    const handleToggle = () => setHidden(!hidden)

    return (
        <InputIcon
            icon={
                <button type='button' onClick={handleToggle}>
                    {hidden ? <PiEyeSlashLight /> : <PiEyeLight />}
                </button>
            }
            direct='right'
            type={hidden ? 'password' : 'text'}
        />
    )
}

export default InputPassword
