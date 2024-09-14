type User = {
  name: string
}

export type ResSignIn = {
  accessToken: string
  user: User
}

export type ResSignOut = {
  message: string
}

export type ResRefresh = {
  accessToken: string
}

export type ResAuth = {
  user: User
}
