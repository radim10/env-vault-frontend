import { ListTeam } from '@/types/teams'
import sendRequest, { APIError } from '../instance'
import {
  CurrentUser,
  User,
  WorkspaceInvitation,
  WorkspaceUser,
  WorkspaceUserRole,
} from '@/types/users'
import { UserAccessProject, UserAccessTeamProject } from '@/types/userAccess'

type UsersErrorCode =
  | 'workspace_not_found'
  | 'user_not_found'
  | 'invitation_already_exists'
  | 'invitation_not_found'
  | 'cannot_delete_yourself'
  | 'missing_permissions'

export type UsersError<T extends UsersErrorCode | void> = APIError<T>

export function usersErrorMsgFromCode(code?: UsersErrorCode): string | null {
  let msg = null

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (code === 'user_not_found') {
    msg = 'User not found in current workspace'
  }

  if (code === 'missing_permissions') {
    msg = "You don't have permission to perform this action"
  }

  if (code === 'invitation_not_found') {
    msg = 'Invitation not found'
  }

  if (code === 'cannot_delete_yourself') {
    msg = "You can't delete yourself"
  }

  if (code === 'invitation_already_exists') {
    msg = 'Invitation already exists'
  }

  return msg
}

// TODO:
export type GetCurrentUserError = UsersError<'workspace_not_found'>
export type GetCurrentUserData = CurrentUser & { defaultWorkspace?: string }

export type GetCurrentUserArgs = {
  workspaceId: string
  workspace?: boolean
}

export async function getCurrentUser(args: GetCurrentUserArgs) {
  const { workspaceId, workspace } = args

  return await sendRequest<GetCurrentUserData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users/me`,
    params: workspace && {
      workspace,
    },
  })
}

// NOTE: requests
export type GetWorkspaceUsersError = UsersError<undefined>
export type GetWorkspaceUsersData = { data: WorkspaceUser[]; totalCount: number }

export type GetWorkspaceUsersArgs = {
  workspaceId: string
  pageSize?: number
  page?: number
  sort?: 'name' | 'email' | 'joined' | 'role'
  desc?: boolean
  search?: string
}

export async function getWorkspaceUsers(args: GetWorkspaceUsersArgs) {
  const { workspaceId, page = 0, pageSize = 5, sort, desc, search } = args

  const response = sendRequest<GetWorkspaceUsersData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users`,
    params: {
      page,
      pageSize,
      sort,
      desc,
      search,
    },
  })

  return await response
}

// get single user
export type GetWorkspaceUserError = UsersError<'workspace_not_found' | 'user_not_found'>
export type GetWorkspaceUserData = WorkspaceUser

export type GetWorkspaceUserArgs = {
  workspaceId: string
  userId: string
}

export async function getWorkspaceUser(args: GetWorkspaceUserArgs) {
  const { workspaceId, userId } = args

  return await sendRequest<GetWorkspaceUserData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users/${userId}`,
  })
}

// get user team memberships
export type GetUserTeamsError = UsersError<'workspace_not_found' | 'user_not_found'>
// export type GetUserTeamsData = Array<Pick<Team, 'id' | 'name'>>
export type GetUserTeamsData = Array<ListTeam>

export type GetUserTeamsArgs = {
  workspaceId: string
  userId: string
}

export async function getUserTeams(args: GetUserTeamsArgs) {
  const { workspaceId, userId } = args

  return await sendRequest<GetUserTeamsData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users/${userId}/teams`,
  })
}

// get user project access - granted for individual users
export type GetUserAccessProjectsError = UsersError<'workspace_not_found' | 'user_not_found'>
export type GetUserAccessProjectsData = UserAccessProject[]

export type GetUserAccessProjectsArgs = {
  workspaceId: string
  userId: string
}

export async function getUserAccessProjects(args: GetUserAccessProjectsArgs) {
  const { workspaceId, userId } = args

  return await sendRequest<GetUserAccessProjectsData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users/${userId}/access/user`,
  })
}

// get user project access - granted for team
export type GetUserAccessTeamProjectsError = UsersError<'workspace_not_found' | 'user_not_found'>
export type GetUserAccessTeamProjectsData = UserAccessTeamProject[]

export type GetUserAccessTeamProjectsArgs = GetUserAccessProjectsArgs

export async function getUserAccessTeamProjects(args: GetUserAccessTeamProjectsArgs) {
  const { workspaceId, userId } = args

  return await sendRequest<GetUserAccessTeamProjectsData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users/${userId}/access/team`,
  })
}

// search
export type SearchWorkspaceUsersError = UsersError<undefined>
export type SearchWorkspaceUsersData = Array<User & { isTeamMember?: boolean }>

export type SearchWorkspaceUsersArgs = {
  workspaceId: string
  value: string
  teamId?: string
}

export async function searchWorkspaceUsers(args: SearchWorkspaceUsersArgs) {
  const { workspaceId, value, teamId } = args

  const response = sendRequest<SearchWorkspaceUsersData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users/search`,
    params: {
      value,
      team: teamId,
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

// list workspace invitations
export type ListWorkspaceInvitationsError = UsersError<'workspace_not_found'>
export type ListWorkspaceInvitationsData = { data: WorkspaceInvitation[]; totalCount: number }

export type ListWorkspaceInvitationsArgs = {
  workspaceId: string
  // page?: number
  // sort?: 'sender' | 'email' | 'role' | 'sent'
  // desc?: boolean
  // search?: string
}

export async function listWorkspaceInvitations(args: ListWorkspaceInvitationsArgs) {
  // const { workspaceId, page, desc, sort, search } = args
  const { workspaceId } = args

  return await sendRequest<ListWorkspaceInvitationsData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/users/invitations`,
  })
}

// create workspace invitation
export type CreateWorkspaceInvitationError = UsersError<
  'workspace_not_found' | 'invitation_already_exists'
>
export type CreateWorkspaceInvitationResData = { id: string }

export type CreateWorkspaceInvitationArgs = {
  workspaceId: string
  email: string
  role: WorkspaceUserRole
}

export async function createWorkspaceInvitation(args: CreateWorkspaceInvitationArgs) {
  const { workspaceId, email, role } = args

  return await sendRequest<CreateWorkspaceInvitationResData>({
    method: 'POST',
    basePath: `workspaces`,
    path: `${workspaceId}/users/invitations`,
    body: {
      email,
      role,
    },
  })
}

// delete workspace invitation
export type DeleteWorkspaceInvitationError = UsersError<
  'workspace_not_found' | 'invitation_not_found'
>
export type DeleteWorkspaceInvitationResData = undefined

export type DeleteWorkspaceInvitationArgs = {
  workspaceId: string
  invitationId: string
}

export async function deleteWorkspaceInvitation(args: DeleteWorkspaceInvitationArgs) {
  const { workspaceId, invitationId } = args

  return await sendRequest<DeleteWorkspaceInvitationResData>({
    method: 'DELETE',
    basePath: `workspaces`,
    path: `${workspaceId}/users/invitations/${invitationId}`,
  })
}

// resend workspace invitation
export type ResendWorkspaceInvitationError = DeleteWorkspaceInvitationError
export type ResendWorkspaceInvitationResData = DeleteWorkspaceInvitationResData

export type ResendWorkspaceInvitationArgs = DeleteWorkspaceInvitationArgs

export async function resendWorkspaceInvitation(args: ResendWorkspaceInvitationArgs) {
  const { workspaceId, invitationId } = args

  return await sendRequest<ResendWorkspaceInvitationResData>({
    method: 'POST',
    basePath: `workspaces`,
    path: `${workspaceId}/users/invitations/${invitationId}/resend`,
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
