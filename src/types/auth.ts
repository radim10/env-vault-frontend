export const AuthType = {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  GITHUB: 'GITHUB',
} as const

export type AuthType = (typeof AuthType)[keyof typeof AuthType]
