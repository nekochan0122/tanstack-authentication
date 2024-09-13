import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { cors } from 'hono/cors'

const app = new Hono()
const port = 6969

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.use(
  '/auth/*',
  basicAuth({
    username: 'admin',
    password: 'admin',
  }),
)

app.get('/auth/user', async (c) => {
  return c.json({
    username: 'John Doe',
  })
})

serve({
  fetch: app.fetch,
  port,
})

console.log(`Server is running at http://localhost:${port}`)
