export enum EnvTokenGrant {
  READ,
  WRITE,
  READ_WRITE,
}

export interface EnvironmentToken {
  name: string
  revoked: boolean
  expiresAt: string | null
  grant: EnvTokenGrant
  createdAt: string
  value: string
}
