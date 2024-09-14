import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ACCESS_TOKEN } from '~/lib/constants'
import { ky } from '~/lib/ky-with-auth'
import type { SignInFormSchema } from '~/lib/schema'
import type { ResSignIn } from '~/types/response'

export function useSignInMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['sign-in'],
    mutationFn: async ({ username, password }: SignInFormSchema) => {
      return ky
        .post('sign-in', {
          json: {
            username,
            password,
          },
        })
        .json<ResSignIn>()
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth'], { user: data.user })
      sessionStorage.setItem(ACCESS_TOKEN, data.accessToken)
    },
    onError: () => {
      sessionStorage.removeItem(ACCESS_TOKEN)
    },
  })
}
