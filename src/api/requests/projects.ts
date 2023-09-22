import { ListProject, Project } from '@/types/projects'
import sendRequest, { APIError } from '../instance'

// list
export type GetProjectsError = APIError<'Workspace not found'>
export type GetProjectsData = Awaited<ReturnType<typeof getProjects>>

export async function getProjects(args: { workspaceId: string }) {
  const { workspaceId } = args

  const response = sendRequest<Array<ListProject>>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects`,
  })
  return await response
}

export type GetProjectError = APIError<'Workspace not found' | 'Project not found'>
export type GetProjectData = Awaited<ReturnType<typeof getProject>>

export async function getProject(args: { workspaceId: string; projectName: string }) {
  const { workspaceId } = args

  const response = sendRequest<Project>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${args.projectName}`,
  })
  return await response
}
