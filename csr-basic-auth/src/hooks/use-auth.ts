import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { userQueryOptions, useUserQuery } from '~/api/use-user-query'
import { BASIC_AUTH_TOKEN } from '~/lib/constants'
import { router } from '~/lib/router'
import type { ResAuthUser } from '~/types/response'

type AuthState =
  | { user: null; status: 'PENDING' }
  | { user: null; status: 'UNAUTHENTICATED' }
  | { user: ResAuthUser; status: 'AUTHENTICATED' }

type AuthUtils = {
  signIn: () => void
  signOut: () => void
  ensureData: () => Promise<ResAuthUser | undefined>
}

type AuthData = AuthState & AuthUtils

function useAuth(): AuthData {
  const userQuery = useUserQuery()
  const queryClient = useQueryClient()

  useEffect(() => {
    router.invalidate()
  }, [userQuery.data])

  const utils: AuthUtils = {
    signIn: () => {
      router.navigate({ to: '/sign-in' })
    },
    signOut: () => {
      sessionStorage.removeItem(BASIC_AUTH_TOKEN)
      queryClient.setQueryData(['user'], null)
    },
    ensureData: () => {
      return queryClient.ensureQueryData(
        userQueryOptions(),
      )
    },
  }

  switch (true) {
    case userQuery.isPending:
      return { ...utils, user: null, status: 'PENDING' }

    case !userQuery.data:
      return { ...utils, user: null, status: 'UNAUTHENTICATED' }

    default:
      return { ...utils, user: userQuery.data, status: 'AUTHENTICATED' }
  }
}

export { useAuth }
export type { AuthData }
