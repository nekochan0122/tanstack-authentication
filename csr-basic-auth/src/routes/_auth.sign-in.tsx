import { createFileRoute } from '@tanstack/react-router'
import type { FormEvent } from 'react'

import { useSignInMutation } from '~/api/use-sign-in-mutation'
import { signInFormSchema } from '~/lib/schema'

export const Route = createFileRoute('/_auth/sign-in')({
  component: SignInComponent,
})

function SignInComponent() {
  const signInMutation = useSignInMutation()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData)
    const dataParsed = signInFormSchema.parse(data)

    await signInMutation.mutateAsync(dataParsed)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='flex w-max flex-col gap-2 [&>input]:max-w-64 [&>input]:border'
      >
        <input type='text' name='username' placeholder='Username' defaultValue='admin' />
        <input type='password' name='password' placeholder='Password' defaultValue='admin' />
        <button type='submit' className='border'>Sign In</button>
      </form>
      {signInMutation.error && <p>{signInMutation.error.message}</p>}
    </>
  )
}
