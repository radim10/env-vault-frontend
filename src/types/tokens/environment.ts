export enum EnvTokenPermission {
  READ = 'READ',
  WRITE = 'WRITE',
  READ_WRITE = 'READ_WRITE',
}

export interface EnvironmentToken {
  id: string
  name: string
  revoked: boolean
  expiresAt: string | null
  permission: EnvTokenPermission
  createdAt: string
  last5: string
}

// for tokens from home
export type ReadOnlyEnvToken = Omit<EnvironmentToken, 'id'> & {
  // names
  ref: {
    project: string
    environment: string
  }
}
