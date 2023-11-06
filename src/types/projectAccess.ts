import { ListTeam } from './teams'

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
