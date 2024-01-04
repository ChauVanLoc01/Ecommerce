import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'react-toastify'
import { UserFetching } from 'src/Api/UserFetching'
import { OptionUser } from 'src/types/User'

function useUpdateUser(refetching = true) {
  const clientQuery = useQueryClient()
  const EditUser = useMutation({
    mutationFn: (body: Partial<OptionUser>) =>
      UserFetching.UpdateFetching(body),
    onSuccess(data, variables, context) {
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        progress: undefined,
        theme: 'colored'
      })
      refetching && clientQuery.invalidateQueries({ queryKey: ['user'] })
    }
  })
  return EditUser
}

export default useUpdateUser
