import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/secret')({
  component: AuthenticatedSecretRoute,
})

function AuthenticatedSecretRoute() {
  return (
    <>
      <p>This is a secret page</p>
    </>
  )
}
