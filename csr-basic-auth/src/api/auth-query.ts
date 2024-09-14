import { queryOptions, useQuery } from '@tanstack/react-query'

import { ky } from '~/lib/ky-with-auth'
import type { ResAuthUser } from '~/types/response'

export function authOptions() {
  return queryOptions({
    queryKey: ['auth'],
    queryFn: () => ky.get('auth').json<ResAuthUser>(),
    retry: false,
  })
}

export function useAuthQuery() {
  return useQuery(authOptions())
}
