import ky, { HTTPError } from 'ky'

import { ACCESS_TOKEN } from '~/lib/constants'
import type { ResRefresh } from '~/types/response'

const kyWithAuth = ky.create({
  prefixUrl: 'http://localhost:6969',
  credentials: 'include',
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = sessionStorage.getItem(ACCESS_TOKEN)
        if (!accessToken) return

        request.headers.set('Authorization', `Bearer ${accessToken}`)
      },
    ],
    beforeRetry: [
      async ({ request, error, options }) => {
        if (error instanceof HTTPError && error.response.status === 401) {
          const data = await ky
            .get('refresh', { ...options, retry: 0 })
            .json<ResRefresh>()

          const newAccessToken = data.accessToken

          sessionStorage.setItem(ACCESS_TOKEN, newAccessToken)

          request.headers.set('Authorization', `Bearer ${newAccessToken}`)
        }
      },
    ],
  },
  retry: {
    limit: 1,
    statusCodes: [401, 403, 500, 504],
  },
})

export { kyWithAuth as ky }
