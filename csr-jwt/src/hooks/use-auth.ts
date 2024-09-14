import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { authQueryOptions, useAuthQuery } from '~/api/auth-query'
import { useSignOutMutation } from '~/api/sign-out-mutation'
import { router } from '~/lib/router'
import type { ResAuth } from '~/types/response'

type AuthState =
  | { user: null; status: 'PENDING' }
  | { user: null; status: 'UNAUTHENTICATED' }
  | { user: ResAuth['user']; status: 'AUTHENTICATED' }

type AuthUtils = {
  signIn: () => void
  signOut: () => void
  ensureData: () => Promise<ResAuth | undefined>
}

type AuthData = AuthState & AuthUtils

function useAuth(): AuthData {
  const authQuery = useAuthQuery()
  const signOutMutation = useSignOutMutation()

  const queryClient = useQueryClient()

  useEffect(() => {
    router.invalidate()
  }, [authQuery.data])

  useEffect(() => {
    if (authQuery.error === null) return
    queryClient.setQueryData(['auth'], null)
  }, [authQuery.error, queryClient])

  const utils: AuthUtils = {
    signIn: () => {
      router.navigate({ to: '/sign-in' })
    },
    signOut: () => {
      signOutMutation.mutate()
    },
    ensureData: () => {
      return queryClient.ensureQueryData(
        authQueryOptions(),
      )
    },
  }

  switch (true) {
    case authQuery.isPending:
      return { ...utils, user: null, status: 'PENDING' }

    case !authQuery.data:
      return { ...utils, user: null, status: 'UNAUTHENTICATED' }

    default:
      return { ...utils, user: authQuery.data.user, status: 'AUTHENTICATED' }
  }
}

export { useAuth }
export type { AuthData }
