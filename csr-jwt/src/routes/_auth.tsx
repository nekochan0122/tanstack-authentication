import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_auth')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.status === 'AUTHENTICATED') {
      throw redirect({
        to: search.redirect || '/',
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <>
      <Outlet />
    </>
  )
}
