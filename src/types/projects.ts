import { Environment } from './environments'

export interface Project {
  // id: string // ??
  createdAt: string
  description: string | null
  name: string
  environments: Array<Pick<Environment, 'name'>>
}

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
