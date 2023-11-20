import { ListTeam } from './teams'
import { User } from './users'

export enum ProjectRole {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

export type ProjectAccessTeam = ListTeam & {
  role: ProjectRole
}

// for access combobox
export type SearchProjectAccessTeam = ListTeam & {
  projectAccess: boolean
}

export type SearchProjectAccessUser = User & {
  hasProjectAccess: boolean
  isTeamAccess: boolean
}

// useres
export type ProjectAccessUser = User & {
  role: ProjectRole
  isAutoRole?: boolean
}
