import { User } from '@/types/users'
import sendRequest, { APIError } from '@/api/instance'
import {
  ProjectAccessTeam,
  ProjectAccessUser,
  ProjectRole,
  SearchProjectAccessUser,
} from '@/types/projectAccess'

// NOTE: errors
type ProjectAccessErrorCode = 'project_not_found'
export type ProjectAccessError<T extends ProjectAccessErrorCode | void> = APIError<
  T | 'workspace_not_found'
>

export function projectAccessErrorMsgFromCode(
  code: ProjectAccessErrorCode | 'workspace_not_found'
): string {
  let msg = ''

  if (code === 'project_not_found') {
    msg = 'Project not found'
  }

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  return msg
}

export type ProjectAccessArgs = {
  workspaceId: string
  projectName: string
}

// NOTE: requests
export type GetProjectAccessTeamsError = ProjectAccessError<'project_not_found'>
export type GetProjectAccessTeamsData = ProjectAccessTeam[]

export type GetProjectAccessTeamsArgs = ProjectAccessArgs

export async function getProjectAccessTeams(args: GetProjectAccessTeamsArgs) {
  const { workspaceId, projectName } = args

  return await sendRequest<GetProjectAccessTeamsData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/access/teams`,
  })
}

// add
export type UpdateProjectAccessTeamsError = ProjectAccessError<'project_not_found'>
export type UpdateProjectAccessTeamsResData = undefined

// ids array for now
export type UpdateProjectAccessTeamsData = {
  // add?: Array<{ id: string; role: ProjectRole }>
  add?: { ids: string[]; role: ProjectRole }
  remove?: string[]
}

export type UpdateProjectAccessTeamsArgs = ProjectAccessArgs & {
  data: UpdateProjectAccessTeamsData
}

export async function addProjectAccessTeams(args: UpdateProjectAccessTeamsArgs) {
  const { workspaceId, projectName, data } = args

  return await sendRequest<UpdateProjectAccessTeamsResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/access/teams`,
    body: data,
  })
}

// NOTE: users
// get
export type GetProjectAccessUsersError = GetProjectAccessTeamsError
export type GetProjectAccessUsersArgs = GetProjectAccessTeamsArgs
export type GetProjectAccessUsersData = ProjectAccessUser[]

export async function getProjectAccessUsers(args: GetProjectAccessUsersArgs) {
  const { workspaceId, projectName } = args

  return await sendRequest<GetProjectAccessUsersData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/access/users`,
  })
}

// update
export type UpdateProjectAccessUsersError = GetProjectAccessTeamsError
export type UpdateProjectAccessUsersResData = undefined

export type UpdateProjectAccessUsersData = {
  // add?: Array<{ id: string; role: ProjectRole }>
  // add?: { ids: string[]; role: ProjectRole }
  // add?: { [key in ProjectRole]?: string[] }
  add?: Array<{ id: string; role: ProjectRole }>
  remove?: string[]
}

export type UpdateProjectAccessUsersArgs = ProjectAccessArgs & {
  data: UpdateProjectAccessUsersData
}

export async function updateProjectAccessUsers(args: UpdateProjectAccessUsersArgs) {
  const { workspaceId, projectName, data } = args

  return await sendRequest<UpdateProjectAccessUsersResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/access/users`,
    body: data,
  })
}

// search users for access
export type SearchSelectProjectAccessUsersError = GetProjectAccessTeamsError
export type SearchSelectProjectAccessUsersData = SearchProjectAccessUser[]

export type SearchSelectProjectAccessUsersArgs = ProjectAccessArgs & {
  value: string
}

export async function searchSelectProjectAccessUsers(args: SearchSelectProjectAccessUsersArgs) {
  const { workspaceId, projectName, value } = args

  return await sendRequest<SearchSelectProjectAccessUsersData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/users/search`,
    params: {
      value,
      project: projectName,
    },
  })
}
