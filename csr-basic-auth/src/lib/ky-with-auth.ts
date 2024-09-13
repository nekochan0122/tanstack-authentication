import ky from 'ky'

import { ENCODED_CREDENTIALS } from '~/lib/constants'

const kyWithAuth = ky.create({
  prefixUrl: 'http://localhost:6969',
  hooks: {
    beforeRequest: [
      (request) => {
        const encodedCredentials = sessionStorage.getItem(ENCODED_CREDENTIALS)
        request.headers.set('Authorization', `Basic ${encodedCredentials}`)
      },
    ],
  },
})

export { kyWithAuth as ky }
