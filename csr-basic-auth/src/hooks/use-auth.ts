import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { authOptions, useAuthQuery } from '~/api/auth-query'
import { ENCODED_CREDENTIALS } from '~/lib/constants'
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
  const userQuery = useAuthQuery()
  const queryClient = useQueryClient()

  useEffect(() => {
    router.invalidate()
  }, [userQuery.data])

  const utils: AuthUtils = {
    signIn: () => {
      router.navigate({ to: '/sign-in' })
    },
    signOut: () => {
      sessionStorage.removeItem(ENCODED_CREDENTIALS)
      queryClient.setQueryData(['auth'], null)
    },
    ensureData: () => {
      return queryClient.ensureQueryData(
        authOptions(),
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
