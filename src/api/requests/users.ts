import sendRequest, { APIError } from '../instance'
import { User, WorkspaceUser, WorkspaceUserRole } from '@/types/users'

type UsersErrorCode = 'workspace_not_found' | 'user_not_found' | 'invitation_already_exists'
export type UsersError<T extends UsersErrorCode | void> = APIError<T>

export function usersErrorMsgFromCode(code: UsersErrorCode): string {
  let msg = ''

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (code === 'user_not_found') {
    msg = 'User not found in current workspace'
  }

  if (code === 'invitation_already_exists') {
    msg = 'Invitation already exists'
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
  search?: string
}

export async function getWorkspaceUsers(args: GetWorkspaceUsersArgs) {
  const { workspaceId, page = 0, sort, desc, search } = args

  const response = sendRequest<GetWorkspaceUsersData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users`,
    params: {
      page,
      sort,
      desc,
      search,
    },
  })

  return await response
}

// check workspace user email
export type CheckWorkspaceUserEmailError = UsersError<'workspace_not_found' | 'user_not_found'>
export type CheckWorkspaceUserEmailResData = { exists: boolean }

export type CheckWorkspaceUserEmailArgs = {
  workspaceId: string
  email: string
}

export async function checkWorkspaceUserEmail(args: CheckWorkspaceUserEmailArgs) {
  const { workspaceId, email } = args

  const response = sendRequest<CheckWorkspaceUserEmailResData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users/check-email`,
    params: {
      email,
    },
  })

  return await response
}

// create workspace invitation
export type CreateWorkspaceInvitationError = UsersError<
  'workspace_not_found' | 'invitation_already_exists'
>
export type CreateWorkspaceInvitationResData = { id: string }

export type CreateWorkspaceInvitationArgs = {
  workspaceId: string
  email: string
}

export async function createWorkspaceInvitation(args: CreateWorkspaceInvitationArgs) {
  const { workspaceId, email } = args

  return await sendRequest<CreateWorkspaceInvitationResData>({
    method: 'POST',
    basePath: `workspaces`,
    path: `${workspaceId}/users/invitations`,
    body: {
      email,
    },
  })
}

// update role
export type UpdateWorkspaceUserRoleError = UsersError<'user_not_found'>
export type UpdateWorkspaceUserRoleData = { role: WorkspaceUserRole }
export type UpdateWorkspaceUserRoleResData = undefined

export type UpdateWorkspaceUserRoleArgs = {
  workspaceId: string
  userId: string
  role: WorkspaceUserRole
}

export async function updateWorkspaceUserRole(args: UpdateWorkspaceUserRoleArgs) {
  const { workspaceId, userId, role } = args

  const response = sendRequest<UpdateWorkspaceUserRoleResData>({
    method: 'PATCH',
    basePath: `workspaces`,
    path: `${workspaceId}/users/${userId}`,
    body: { role },
  })

  return await response
}

// delete workspace user
export type DeleteWorkspaceUserError = UsersError<'user_not_found'>

export type DeleteWorkspaceUserArgs = {
  workspaceId: string
  userId: string
}

export async function deleteWorkspaceUser(args: DeleteWorkspaceUserArgs) {
  const { workspaceId, userId } = args

  const response = sendRequest<undefined>({
    method: 'DELETE',
    basePath: `workspaces`,
    path: `${workspaceId}/users/${userId}`,
  })

  return await response
}
