export interface Project {
  id: string
  createdAt: string
  description: string
  name: string
}

export type ListProject = Pick<Project, 'createdAt' | 'description' | 'name'> & {
  environmentCount: number
}
