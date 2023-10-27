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
export type GetWorkspaceUsersData = { data: WorkspaceUser[]; totalCount: number }

export type GetWorkspaceUsersArgs = {
  workspaceId: string
  page?: number
  sort?: 'name' | 'email' | 'joined' | 'role'
  desc?: boolean
}

export async function getWorkspaceUsers(args: GetWorkspaceUsersArgs) {
  const { workspaceId, page = 0, sort, desc } = args

  const response = sendRequest<GetWorkspaceUsersData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users`,
    params: {
      page,
      sort,
      desc,
    },
  })

  return await response
}
