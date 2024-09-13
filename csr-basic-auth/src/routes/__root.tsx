import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { Navigation } from '~/components/navigation'
import type { RouterContext } from '~/lib/router'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Navigation />
      <main className='p-2'>
        <Outlet />
      </main>
      <ReactQueryDevtools buttonPosition='bottom-left' />
      <TanStackRouterDevtools position='bottom-right' />
    </>
  )
}
