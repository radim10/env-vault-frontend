import { ListTeam } from './teams'
import { User } from './users'

export enum ProjectRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
}

export type ProjectAccessTeam = ListTeam & {
  role: ProjectRole
}

// for access combobox
export type SearchProjectAccessTeam = ListTeam & {
  projectAccess: boolean
}

// useres
export type ProjectAccessUser = User & {
  role: ProjectRole
  isAutoRole?: boolean
}
