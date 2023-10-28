export interface User {
  // uuid
  id: string
  name: string
  avatarUrl: string | null
  email: string
  // roles: string[]
}

export enum WorkspaceUserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export type WorkspaceUser = User & { role: WorkspaceUserRole; joinedAt: Date }
