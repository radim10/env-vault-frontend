export type WorkspaceTokenPermissions = {
  projects?: Array<'read' | 'write' | 'delete'>
  environments?: Array<'read' | 'write' | 'delete'>
  secrets?: Array<'read' | 'write' | 'delete'>
}

// export type WorkspaceTokenGrant = {
//   project?: Array<'READ' | 'WRITE'>
//   environment?: Array<'READ' | 'WRITE'>
// }
//
export interface WorkspaceToken {
  id: string
  name: string
  // revoked: boolean
  permissions: WorkspaceTokenPermissions
  expiresAt: string | null
  createdAt: string
  last5: string
}
