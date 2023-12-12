import React, { useId } from 'react'

const useIdHook = () => {
  const id = useId()
  return id
}

export default useIdHook
