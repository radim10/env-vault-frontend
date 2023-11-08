import { ProjectRole } from './projectAccess'
import { Project } from './projects'
import { User } from './users'

export interface Team {
  id: string
  name: string
  description: string | null
  createdAt: Date
  createdBy: Pick<User, 'name' | 'avatarUrl'>
}

export interface ListTeam {
  id: string
  name: string
  membersCount: number
  // for access combobox
  projectAccess?: boolean
}

export interface UpdateTeamData {
  name?: string
  description?: string | null
}

export type TeamProjectAccess = Pick<Project, 'name'> & {
  role: ProjectRole
}
