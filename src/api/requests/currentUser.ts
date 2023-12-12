import { CurrentUser } from '@/types/users'
import sendRequest, { APIError } from '../instance'
import { UserSession } from '@/types/session'

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
export type GetCurrentUserData = CurrentUser & {
  defaultWorkspace?: string
  workspaces?: Array<{ id: string; name: string }>
}

export type GetCurrentUserArgs = {
  workspaceId: string
  workspaces?: boolean
  session: UserSession
}

export async function getCurrentUser(args: GetCurrentUserArgs) {
  const { session, workspaceId, workspaces } = args

  return await sendRequest<GetCurrentUserData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/me`,
    params: workspaces && {
      workspaces,
    },
    session,
  })
}

//  workspaces
export type ListUserWorkspacesError = CurrentUserError<'user_not_found'>
export type ListUserWorkspacesData = Array<{ id: string; name: string; default?: true }>

export async function listUserWorkspaces() {
  return await sendRequest<ListUserWorkspacesData>({
    method: 'GET',
    basePath: `me`,
    path: `workspaces`,
  })
}

// update
//  TODO: error
export type UpdateDefaultWorkspaceError = CurrentUserError<'user_not_found'>
export type UpdateDefaultWorkspaceData = {
  workspaceId: string
}

export type UpdateDefaultWorkspaceResData = undefined

export async function updateDefaultWorkspace(args: UpdateDefaultWorkspaceData) {
  const { workspaceId } = args

  return await sendRequest<UpdateDefaultWorkspaceResData>({
    method: 'PATCH',
    basePath: `me`,
    path: `default-workspace`,
    body: {
      workspaceId,
    },
  })
}

// update profile
// NOTE: for now only name
export type UpdateUserProfileError = CurrentUserError<'user_not_found'>
export type UpdateUserProfileData = {
  name: string
}

export type UpdateUserProfileResData = undefined

export async function updateUserProfile(data: UpdateUserProfileData) {
  return await sendRequest<UpdateUserProfileResData>({
    method: 'PATCH',
    basePath: 'me',
    path: `profile`,
    body: data,
  })
}

// delete account
// TODO: error
export type DeleteAccountError = CurrentUserError<'user_not_found'>
export type DeleteAccountData = undefined

export type DeleteAccountResData = undefined

export async function deleteAccount() {
  return await sendRequest<DeleteAccountResData>({
    method: 'DELETE',
    basePath: 'me',
    path: `account`,
  })
}
