import { queryOptions, useQuery } from '@tanstack/react-query'

import { ky } from '~/lib/ky-with-auth'
import type { ResAuth } from '~/types/response'

export function authQueryOptions() {
  return queryOptions({
    queryKey: ['auth'],
    queryFn: () => ky.get('auth').json<ResAuth>(),
  })
}

export function useAuthQuery() {
  return useQuery(authQueryOptions())
}
