import sendRequest, { APIError } from '@/api/instance'
import { ListTeam } from '@/types/teams'

// NOTE: errors
type ProjectAccessErrorCode = 'project_not_found'
export type ProjectAccessError<T extends ProjectAccessErrorCode | void> = APIError<
  T | 'workspace_not_found'
>

export function projectErrorMsgFromCode(
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

// NOTE: requests
export type GetProjectAccessTeamsError = ProjectAccessError<'project_not_found'>
export type GetProjectAccessTeamsData = ListTeam[]

export type GetProjectAccessTeamsArgs = {
  workspaceId: string
  projectName: string
}

export async function getProjectAccessTeams(args: GetProjectAccessTeamsArgs) {
  const { workspaceId, projectName } = args

  return await sendRequest<GetProjectAccessTeamsData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/access/teams`,
  })
}

// add
export type AddProjectAccessTeamsError = ProjectAccessError<'project_not_found'>
export type AddProjectAccessTeamsResData = undefined

export type AddProjectAccessTeamsArgs = {
  workspaceId: string
  projectName: string
  data: {
    // ids
    teams: string[]
  }
}

export async function addProjectAccessTeams(args: AddProjectAccessTeamsArgs) {
  const { workspaceId, projectName, data } = args

  return await sendRequest<AddProjectAccessTeamsResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/projects/${projectName}/access/teams`,
    body: data,
  })
}
