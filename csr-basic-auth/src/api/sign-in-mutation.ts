import { useMutation, useQueryClient } from '@tanstack/react-query'

import { BASIC_AUTH_TOKEN } from '~/lib/constants'
import { ky } from '~/lib/ky-with-auth'
import type { SignInFormSchema } from '~/lib/schema'
import type { ResAuthUser } from '~/types/response'

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['sign-in'],
    mutationFn: async ({ username, password }: SignInFormSchema) => {
      const basicAuthToken = btoa(`${username}:${password}`)

      sessionStorage.setItem(BASIC_AUTH_TOKEN, basicAuthToken)

      return ky.get('auth/user').json<ResAuthUser>()
    },
    onSuccess(data) {
      queryClient.setQueryData(['user'], data)
    },
    onError() {
      queryClient.setQueryData(['user'], null)
      sessionStorage.removeItem(BASIC_AUTH_TOKEN)
    },
    retry: false,
  })
}
