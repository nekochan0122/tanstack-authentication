import { queryOptions, useQuery } from '@tanstack/react-query'

import { ky } from '~/lib/ky-with-auth'
import type { ResAuthUser } from '~/types/response'

export function userQueryOptions() {
  return queryOptions({
    queryKey: ['user'],
    queryFn: () => ky.get('auth/user').json<ResAuthUser>(),
    retry: false,
  })
}

export function useUserQuery() {
  return useQuery(userQueryOptions())
}
