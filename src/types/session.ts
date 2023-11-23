export interface UserSession {
  accessToken: string
  refreshToken: string
  // unix timestamp
  accessTokenExpiresAt: number
  refreshTokenExpiresAt: number
}
