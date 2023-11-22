import { Environment } from './environments'
import { ProjectRole } from './projectAccess'
import { User } from './users'

export interface Project {
  createdAt: string
  description: string | null
  name: string
  userRole: ProjectRole
  createdBy?: Pick<User, 'name' | 'avatarUrl'>
  // environments: ListEnvironment[]
}

export type ListEnvironment = Environment & { secretsCount: number }

export type ListProject = Pick<Project, 'createdAt' | 'description' | 'name'> & {
  environmentCount: number
}

export interface NewProject {
  name: string
  description?: string
  environments?: Array<Pick<Environment, 'name' | 'type'>>
}

export interface UpdatedProjectData {
  name?: string
  description?: string | null
}

export enum ProjectSort {
  CreatedDesc = 'Created desc',
  CreatedAsc = 'Created asc',
  EnvCountDesc = 'Environment count desc',
  EnvCountAsc = 'Environment count asc',
  AlphabeticalAsc = 'Alphabetical asc',
  AlphabeticalDesc = 'Alphabetical desc',
}
