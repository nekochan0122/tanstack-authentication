import { createFileRoute } from '@tanstack/react-router'

import { useAuth } from '~/hooks/use-auth'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const auth = useAuth()

  return (
    <>
      <h3>Welcome {auth.user?.username || 'Guest'}!</h3>
    </>
  )
}
