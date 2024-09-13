import ky from 'ky'

import { BASIC_AUTH_TOKEN } from '~/lib/constants'

const kyWithAuth = ky.create({
  prefixUrl: 'http://localhost:6969',
  hooks: {
    beforeRequest: [
      (request) => {
        const token = sessionStorage.getItem(BASIC_AUTH_TOKEN)
        request.headers.set('Authorization', `Basic ${token}`)
      },
    ],
  },
})

export { kyWithAuth as ky }
