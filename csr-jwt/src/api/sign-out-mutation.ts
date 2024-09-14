import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ACCESS_TOKEN } from '~/lib/constants'
import { ky } from '~/lib/ky-with-auth'
import type { ResSignOut } from '~/types/response'

export function useSignOutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['sign-out'],
    mutationFn: async () => {
      return ky
        .post('sign-out')
        .json<ResSignOut>()
    },
    onSuccess: () => {
      queryClient.setQueryData(['auth'], null)
      sessionStorage.removeItem(ACCESS_TOKEN)
    },
  })
}
