import { Environment } from './environments'

export interface Project {
  // id: string // ??
  createdAt: string
  description: string | null
  name: string
  environments: ListEnvironment[]
}

export type ListEnvironment = Pick<Environment, 'name'> & { secretsCount: number }

export type ListProject = Pick<Project, 'createdAt' | 'description' | 'name'> & {
  environmentCount: number
}

export interface NewProject {
  name: string
  description?: string
}

export interface UpdatedProjectData {
  name?: string
  description?: string | null
}
