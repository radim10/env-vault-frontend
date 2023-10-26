import sendRequest, { APIError } from '../instance'
import { User, WorkspaceUser } from '@/types/users'

type UsersErrorCode = 'workspace_not_found'
export type UsersError<T extends UsersErrorCode | void> = APIError<T>

export function workspacesErrorMsgFromCode(code: UsersErrorCode): string {
  let msg = ''

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  return msg
}

// NOTE: requests
export type GetWorkspaceUsersError = UsersError<undefined>
export type GetWorkspaceUsersData = { data: WorkspaceUser[]; totalCount?: number }

export async function getWorkspaceUsers(id: string) {
  const response = sendRequest<GetWorkspaceUsersData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${id}/users`,
  })
  return await response
}
