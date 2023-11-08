import { ProjectRole } from './projectAccess'
import { Project } from './projects'

export type UserAccessProject = Pick<Project, 'name'> & {
  role: ProjectRole
}

export type UserAccessTeamProject = {
  name: string
  role: ProjectRole
  teamName: string
  teamId: string
}
