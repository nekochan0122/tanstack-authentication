import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import { useAuth } from '~/hooks/use-auth'
import { queryClient } from '~/lib/query'
import { router } from '~/lib/router'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProviderWithContext />
    </QueryClientProvider>
  )
}

function RouterProviderWithContext() {
  const auth = useAuth()

  return <RouterProvider router={router} context={({ auth })} />
}

export { App }
