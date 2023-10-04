export enum EnvTokenGrant {
  READ = 'READ',
  WRITE = 'WRITE',
  READ_WRITE = 'READ_WRITE',
}

export interface EnvironmentToken {
  id: string
  name: string
  revoked: boolean
  expiresAt: string | null
  grant: EnvTokenGrant
  createdAt: string
  value: string
}

// for tokens from home
export type ReadOnlyEnvToken = Omit<EnvironmentToken, 'id'> & {
  // names
  ref: {
    project: string
    environment: string
  }
}
