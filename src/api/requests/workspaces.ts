import { Workspace } from '@/types/workspaces'
import sendRequest, { APIError } from '../instance'

type WorkspacesErrorCode = 'workspace_not_found'
export type WorkspacesError<T extends WorkspacesErrorCode | void> = APIError<T>

export function workspacesErrorMsgFromCode(code: WorkspacesErrorCode): string {
  let msg = ''

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  return msg
}

// NOTE: requests
export type GetWorkspaceError = WorkspacesError<undefined>
export type GetWorkspaceData = Workspace

export async function getWorkspace(id: string) {
  const response = sendRequest<GetWorkspaceData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${id}`,
  })
  return await response
}
