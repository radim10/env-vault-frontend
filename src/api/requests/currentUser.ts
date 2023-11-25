import { CurrentUser } from '@/types/users'
import sendRequest, { APIError } from '../instance'

type CurrentUserErrorCode = 'user_not_found'
export type CurrentUserError<T extends CurrentUserErrorCode | void> = APIError<T>

export function currentUserErrorMsgFromCode(code?: CurrentUserErrorCode): string | null {
  let msg = null

  if (code === 'user_not_found') {
    msg = 'User not found in current workspace'
  }

  return msg
}

export type GetCurrentUserError = CurrentUserError<'user_not_found'>
export type GetCurrentUserData = CurrentUser & { defaultWorkspace?: string }

export type GetCurrentUserArgs = {
  accessToken: string
  workspaceId: string
  workspace?: boolean
}

export async function getCurrentUser(args: GetCurrentUserArgs) {
  const { workspaceId, workspace } = args

  return await sendRequest<GetCurrentUserData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/me`,
    params: workspace && {
      workspace,
    },
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
    },
  })
}
