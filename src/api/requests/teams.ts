import { ListTeam, Team, TeamProjectAccess, UpdateTeamData } from '@/types/teams'
import sendRequest, { APIError } from '../instance'
import { User } from '@/types/users'

type TeamsErrorCode =
  | 'workspace_not_found'
  | 'missing_permission'
  | 'user_not_found'
  | 'team_already_exists'
  | 'team_not_found'
  | 'not_team_member'
  | 'feature_not_available'

export type TeamsError<T extends TeamsErrorCode | void> = APIError<T>

export function teamsErrorMsgFromCode(code?: TeamsErrorCode): string | null {
  let msg = null

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (code === 'missing_permission') {
    msg = "You don't have permission to perform this action"
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

  if (code === 'not_team_member') {
    msg = 'You are not a member of this team'
  }

  if (code === 'feature_not_available') {
    msg = 'Feature is not available'
  }

  return msg
}

// NOTE: requests
export type GetTeamsError = TeamsError<'feature_not_available'>
export type GetTeamsData = ListTeam[]

export type GetTeamsArgs = {
  workspaceId: string
  search?: string
  // for project access - check if has project access
  project?: string
  // pageSize?: number
  // page?: number
  // sort?: 'name' | 'email' | 'joined' | 'role'
  // desc?: boolean
  // search?: string
}

export async function getTeams(args: GetTeamsArgs) {
  const { workspaceId, search, project } = args

  const response = sendRequest<GetTeamsData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/teams`,
    params: {
      search,
      project,
    },
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
export type GetTeamError = TeamsError<
  'feature_not_available' | 'workspace_not_found' | 'team_not_found'
>
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
export type CreateTeamError = TeamsError<
  'feature_not_available' | 'workspace_not_found' | 'team_already_exists'
>
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

// update team
export type UpdateTeamError = TeamsError<
  'workspace_not_found' | 'team_not_found' | 'team_already_exists'
>
export type UpdateTeamResData = undefined

export type UpdateTeamArgs = {
  workspaceId: string
  teamId: string
  data: UpdateTeamData
}

export async function updateTeam(args: UpdateTeamArgs) {
  const { workspaceId, teamId } = args

  return await sendRequest<UpdateTeamResData>({
    method: 'PATCH',
    basePath: `workspaces`,
    path: `${workspaceId}/teams/${teamId}`,
    body: args.data,
  })
}

// delete team
export type DeleteTeamError = TeamsError<'workspace_not_found' | 'team_not_found'>
export type DeleteTeamResData = undefined

export type DeleteTeamArgs = {
  workspaceId: string
  teamId: string
}

export async function deleteTeam(args: DeleteTeamArgs) {
  const { workspaceId, teamId } = args

  return await sendRequest<DeleteTeamResData>({
    method: 'DELETE',
    basePath: `workspaces`,
    path: `${workspaceId}/teams/${teamId}`,
  })
}

// list projects that the team has access to
export type GetTeamProjectsError = TeamsError<'workspace_not_found' | 'team_not_found'>
export type GetTeamProjectsData = TeamProjectAccess[]

export type GetTeamProjectsArgs = {
  workspaceId: string
  teamId: string
}

export async function getTeamProjects(args: GetTeamProjectsArgs) {
  const { workspaceId, teamId } = args

  return await sendRequest<GetTeamProjectsData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/teams/${teamId}/projects`,
  })
}

// get team members
export type GetTeamMembersError = TeamsError<'workspace_not_found' | 'team_not_found'>
export type GetTeamMembersData = {
  data: User[]
  totalCount: number
}

export type GetTeamMembersArgs = {
  workspaceId: string
  teamId: string
  pageSize?: number
  page?: number
  sort?: 'name' | 'email' | 'joined' | 'role'
  desc?: boolean
  search?: string
}

export async function getTeamMembers(args: GetTeamMembersArgs) {
  const { workspaceId, teamId, page = 0, pageSize = 5, sort, desc, search } = args

  return await sendRequest<GetTeamMembersData>({
    method: 'GET',
    basePath: `workspaces`,
    path: `${workspaceId}/teams/${teamId}/members`,
    params: {
      page,
      pageSize,
      sort,
      desc,
      search,
    },
  })
}

// add members to team
export type UpdateTeamMembersError = TeamsError<'workspace_not_found' | 'team_not_found'>
// ids array for now
export type UpdateTeamMembersData = {
  new?: string[]
  removed?: string[]
}
export type UpdateTeamMembersResData = undefined

export type UpdateTeamMembersArgs = {
  workspaceId: string
  teamId: string
  data: UpdateTeamMembersData
}

export async function updateTeamMembers(args: UpdateTeamMembersArgs) {
  const { workspaceId, teamId } = args

  return await sendRequest<UpdateTeamMembersResData>({
    method: 'POST',
    basePath: `workspaces`,
    path: `${workspaceId}/teams/${teamId}/members`,
    body: args.data,
  })
}

// leave team
export type LeaveTeamError = TeamsError<'workspace_not_found' | 'team_not_found'>
export type LeaveTeamResData = undefined

export type LeaveTeamArgs = {
  workspaceId: string
  teamId: string
}

export async function leaveTeam(args: LeaveTeamArgs) {
  const { workspaceId, teamId } = args

  return await sendRequest<LeaveTeamResData>({
    method: 'POST',
    basePath: `workspaces`,
    path: `${workspaceId}/teams/${teamId}/leave`,
  })
}
