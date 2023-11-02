import { ListTeam, Team } from '@/types/teams'
import sendRequest, { APIError } from '../instance'
import { User, WorkspaceInvitation, WorkspaceUser, WorkspaceUserRole } from '@/types/users'

type UsersErrorCode =
  | 'workspace_not_found'
  | 'user_not_found'
  | 'team_already_exists'
  | 'team_not_found'
export type UsersError<T extends UsersErrorCode | void> = APIError<T>

export function usersErrorMsgFromCode(code: UsersErrorCode): string {
  let msg = ''

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (code === 'user_not_found') {
    msg = 'User not found in current workspace'
  }

  if (code === 'team_already_exists') {
    msg = 'Team already exists'
  }

  if (code === 'team_not_found') {
    msg = 'Team not found'
  }

  return msg
}

// NOTE: requests
export type GetTeamsError = UsersError<undefined>
export type GetTeamsData = ListTeam[]

export type GetTeamsArgs = {
  workspaceId: string
  // pageSize?: number
  // page?: number
  // sort?: 'name' | 'email' | 'joined' | 'role'
  // desc?: boolean
  // search?: string
}

export async function getTeams(args: GetTeamsArgs) {
  const { workspaceId } = args

  const response = sendRequest<GetTeamsData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/teams`,
    //   params: {
    //     page,
    //     pageSize,
    //     sort,
    //     desc,
    //     search,
    //   },
  })

  return await response
}

// get single
export type GetTeamError = UsersError<'workspace_not_found' | 'team_not_found'>
export type GetTeamData = Team

export type GetTeamArgs = {
  workspaceId: string
  teamId: string
}

export async function getTeam(args: GetTeamArgs) {
  const { workspaceId, teamId } = args
  return await sendRequest<GetTeamData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/teams/${teamId}`,
  })
}

// create new
export type CreateTeamError = UsersError<'workspace_not_found' | 'team_already_exists'>
export type CreateTeamResData = {
  id: string
}

export type CreateTeamData = {
  name: string
  description?: string
  // user ids for now
  users?: string[]
}
export type CreateTeamArgs = {
  workspaceId: string
  data: CreateTeamData
}

export async function createTeam(args: CreateTeamArgs) {
  const { workspaceId } = args

  return await sendRequest<CreateTeamResData>({
    method: 'POST',
    basePath: `workspaces`,
    path: `${workspaceId}/teams`,
    body: args.data,
  })
}
