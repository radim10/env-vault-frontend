import sendRequest, { APIError } from '@/api/instance'
import { ListProject, NewProject, Project, UpdatedProjectData } from '@/types/projects'

// NOTE: errors
type ProjectsErrorCode = 'project_not_found' | 'project_already_exists' | 'missing_permission'
export type ProjectsError<T extends ProjectsErrorCode | void> = APIError<T | 'workspace_not_found'>

export function projectErrorMsgFromCode(
  code?: ProjectsErrorCode | 'workspace_not_found'
): string | null {
  let msg = null

  if (code === 'project_not_found') {
    msg = 'Project not found'
  }
  if (code === 'project_already_exists') {
    msg = 'Project already exists'
  }
  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (code === 'missing_permission') {
    msg = "You don't have permission to perform this action"
  }

  return msg
}

// NOTE: requests
// list
export type GetProjectsError = ProjectsError<void>
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
export type GetProjectError = ProjectsError<'project_not_found'>
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
export type CreateProjectError = ProjectsError<'project_already_exists'>
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
// export type UpdateProjectError = APIError<
//   'Workspace not found' | 'Project already exists' | 'Project not found'
// >

export type UpdateProjectError = ProjectsError<'project_already_exists' | 'project_not_found'>
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

export type DeleteProjectError = ProjectsError<'project_not_found'>
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
