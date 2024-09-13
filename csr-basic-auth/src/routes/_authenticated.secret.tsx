import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/secret')({
  component: SecretRoute,
})

function SecretRoute() {
  return (
    <>
      <p>This is a secret page</p>
    </>
  )
}
