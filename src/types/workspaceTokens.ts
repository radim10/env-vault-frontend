import { EnvTokenGrant } from './environmentTokens'

export type WorkspaceTokenGrant = EnvTokenGrant

export interface WorkspaceToken {
  id: string
  name: string
  revoked: boolean
  grant: WorkspaceTokenGrant
  expiresAt: string | null
  createdAt: string
  value: string
}
