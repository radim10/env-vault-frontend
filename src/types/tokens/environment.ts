// export enum EnvTokenPermission {
//   READ = 'READ',
//   WRITE = 'WRITE',
//   READ_WRITE = 'READ_WRITE',
// }

// only for secrets, read env by default
export type EnvTokenPermission = 'read' | 'write' | 'delete'

export interface EnvironmentToken {
  id: string
  name: string
  revoked: boolean
  expiresAt: string | null
  permissions: EnvTokenPermission[]
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
