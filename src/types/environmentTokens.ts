export enum EnvTokenGrant {
  READ = 'READ',
  WRITE = 'WRITE',
  READ_WRITE = 'READ_WRITE',
}

export interface EnvironmentToken {
  name: string
  revoked: boolean
  expiresAt: string | null
  grant: EnvTokenGrant
  createdAt: string
  value: string
}
