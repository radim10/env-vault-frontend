import { SubscriptionPlan } from './subscription'

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

export interface WorkspaceInvitation {
  id: string
  createdAt: Date
  lastSentAt: Date | null
  email: string
  role: WorkspaceUserRole
  createdBy: Pick<User, 'name' | 'avatarUrl'>
}

export type CurrentUser = User & {
  // workspaces?: Array<{ id: string; name: string }>
  workspaces: Array<{ id: string; name: string; selected?: true }>
  selectedWorkspace: {
    id: string
    name: string
    role: WorkspaceUserRole
    plan: SubscriptionPlan
  }
}

export type CurrentUserWithWorkspaces = {
  user: CurrentUser
  // for redirect it selected not found
  defaultWorkspace?: string
  workspaces?: Array<{ id: string; name: string; selected?: true }>
  selectedWorkspace?: {
    role: WorkspaceUserRole
    plan: SubscriptionPlan
  }
}
