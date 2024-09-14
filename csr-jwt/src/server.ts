import { serve } from '@hono/node-server'
import { zValidator } from '@hono/zod-validator'
import { hash as hashPassword, verify as verifyPassword } from '@node-rs/argon2'
import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { cors } from 'hono/cors'
import { jwt, sign, verify } from 'hono/jwt'
import { JwtTokenExpired, JwtTokenInvalid } from 'hono/utils/jwt/types'
import { z } from 'zod'

const ACCESS_TOKEN_EXP = 60 * 5
const REFRESH_TOKEN_EXP = 60 * 60 * 24 * 7
const ACCESS_TOKEN_SECRET = '/tSyaxS2fZu0Y4Ry6iZUwcJsoLFUlHP+dtf24JMamuA='
const REFRESH_TOKEN_SECRET = 'MgWQE0MTB9RlnHFPeGEcup+s4E9+CiQtrzNyHd/P2hA='
const REFRESH_TOKEN_COOKIE = 'refresh-token'

type JWTPayload = {
  id: number
  username: string
}

type Variables = {
  jwtPayload: JWTPayload
}

const app = new Hono<{ Variables: Variables }>()
const port = 6969

const db = {
  users: [
    { id: 1, username: 'admin', password: await hashPassword('admin'), name: 'John Doe' },
  ],
}

app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post(
  '/sign-in',
  zValidator(
    'json',
    z.object({
      username: z.string(),
      password: z.string(),
    }),
    async (result, c) => {
      if (!result.success) return c.json(result.error, 400)

      const { username, password } = result.data

      const incorrectResponse = c.json(
        { message: 'username or password is incorrect' },
        401,
      )

      const user = db.users.find((user) => user.username === username)
      if (!user) return incorrectResponse

      const isPasswordMatch = await verifyPassword(user.password, password)
      if (!isPasswordMatch) return incorrectResponse

      const payload: JWTPayload = { id: user.id, username }

      const accessToken = await generateAccessToken(payload, ACCESS_TOKEN_EXP)
      const refreshToken = await generateRefreshToken(payload, REFRESH_TOKEN_EXP)

      setCookie(c, REFRESH_TOKEN_COOKIE, refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
        maxAge: REFRESH_TOKEN_EXP,
      })

      return c.json({ accessToken, user: { name: user.name } })
    },
  ),
)

app.post('/sign-out', (c) => {
  deleteCookie(c, REFRESH_TOKEN_COOKIE)

  return c.json({ message: 'success' })
})

app.get('/refresh', async (c) => {
  const refreshToken = getCookie(c, REFRESH_TOKEN_COOKIE)
  if (!refreshToken) return c.json({ message: 'refresh token not found' }, 401)

  try {
    const decoded = await verify(refreshToken, REFRESH_TOKEN_SECRET) as JWTPayload
    const payload: JWTPayload = { id: decoded.id, username: decoded.username }
    const accessToken = await generateAccessToken(payload, ACCESS_TOKEN_EXP)

    return c.json({ accessToken })

  }
  catch (error) {
    switch (true) {
      case error instanceof JwtTokenExpired:
        return c.json({ message: 'refresh token expired' }, 401)

      case error instanceof JwtTokenInvalid:
        return c.json({ message: 'refresh token invalid' }, 401)

      default:
        return c.json({ message: 'unexpected error', error }, 401)
    }
  }
})

app.use(
  '/auth/*',
  jwt({
    secret: ACCESS_TOKEN_SECRET,
  }),
)

app.get('/auth', (c) => {
  const payload = c.get('jwtPayload')

  const user = db.users.find((user) => user.id === payload.id)
  if (!user) return c.json({ message: 'user not found' }, 404)

  return c.json({
    user: {
      name: user.name,
    },
  })
})

serve({
  fetch: app.fetch,
  port,
})

console.log(`Server is running at http://localhost:${port}`)

function generateAccessToken(payload: JWTPayload, exp: number) {
  return sign(
    {
      ...payload,
      exp: createExpiresAt(exp),
    },
    ACCESS_TOKEN_SECRET,
  )
}

function generateRefreshToken(payload: JWTPayload, exp: number) {
  return sign(
    {
      ...payload,
      exp: createExpiresAt(exp),
    },
    REFRESH_TOKEN_SECRET,
  )
}

function createExpiresAt(time: number) {
  return Math.floor(Date.now() / 1000) + time
}
