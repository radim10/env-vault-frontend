export interface User {
  // uuid
  id: string
  name: string
  avatarUrl: string | null
  // roles: string[]
}

export enum WorkspaceUserRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  OWNER = 'owner',
}

export type WorkspaceUser = User & { role: WorkspaceUserRole; joinedAt: Date }
