export interface UserSession {
  accessToken: string
  refreshToken: string
  // unix timestamp
  accessTokenExpiresAt: number
  refreshTokenExpiresAt: number
}

export interface ListSession {
  id: string
  isCurrent: boolean
  createdAt: string
  lastActive: string
  metadata: {
    ip: string
    os: string
    browser: string
  }
}
