import { ListProject, NewProject, Project, UpdatedProjectData } from '@/types/projects'
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

// get project
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

// create project
export type CreateProjectError = APIError<'Workspace not found' | 'Project already exists'>
export type CreateProjectResData = Awaited<ReturnType<typeof createProject>>

export async function createProject(args: { workspaceId: string; data: NewProject }) {
  const { workspaceId } = args

  const response = sendRequest<undefined>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/projects`,
    body: args.data,
  })
  return await response
}

// update
export type UpdateProjectError = APIError<
  'Workspace not found' | 'Project already exists' | 'Project not found'
>
export type UpdateProjectResData = Awaited<ReturnType<typeof updateProject>>

export async function updateProject(args: {
  workspaceId: string
  name: string
  data: UpdatedProjectData
}) {
  const { workspaceId, name, data } = args

  const response = sendRequest<undefined>({
    method: 'PATCH',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${name}`,
    body: data,
  })
  return await response
}

export type DeleteProjectError = APIError<'Workspace not found' | 'Project note found'>
export type DeleteProjectResData = Awaited<ReturnType<typeof deleteProject>>

export async function deleteProject(args: { workspaceId: string; name: string }) {
  const { workspaceId, name } = args

  const response = sendRequest<undefined>({
    method: 'DELETE',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${name}`,
  })
  return await response
}
