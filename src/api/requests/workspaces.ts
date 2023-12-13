import { Workspace, WorkspaceInvitationLinks } from '@/types/workspaces'
import sendRequest, { APIError } from '../instance'

type WorkspacesErrorCode = 'workspace_not_found' | 'missing_permission' | LeaveWorkspaceErrorCode
type LeaveWorkspaceErrorCode = 'no_remaining_users'

export type WorkspacesError<T extends WorkspacesErrorCode | LeaveWorkspaceErrorCode | void> =
  APIError<T>

export function workspacesErrorMsgFromCode(code?: WorkspacesErrorCode): string {
  let msg = 'Something went wrong'

  switch (code) {
    case 'workspace_not_found':
      msg = 'Workspace not found'
      break
    case 'no_remaining_users':
      msg = 'Last member of workspace cannot leave'
      break
    case 'missing_permission':
      msg = "You don't have permission to perform this action"
      break
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

export type CreateWorkspaceError = WorkspacesError<any>
export type CreateWorkspaceData = Pick<Workspace, 'name'>
export type CreateWorkspaceResData = { id: string }

export async function createWorkspace(name: string) {
  const response = sendRequest<CreateWorkspaceResData>({
    method: 'POST',
    basePath: 'workspaces',
    body: {
      name,
    },
  })
  return await response
}

// TODO: error
export type LeaveWorkspaceError = WorkspacesError<'no_remaining_users'>
export type LeaveWorkspaceResData = { newDefaultWorkspaceId: string | null }

export async function leaveWorkspace(id: string) {
  const response = sendRequest<LeaveWorkspaceResData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${id}/leave`,
  })
  return await response
}

// TODO: error
export type DeleteWorkspaceError = WorkspacesError<'workspace_not_found' | 'missing_permission'>
export type DeleteWorkspaceResData = undefined

export async function deleteWorkspace(id: string) {
  const response = sendRequest<LeaveWorkspaceResData>({
    method: 'DELETE',
    basePath: 'workspaces',
    path: id,
  })
  return await response
}

// get links
export type GetWorkspaceInvitationLinksError = WorkspacesError<'workspace_not_found'>
export type GetWorkspaceInvitationLinksData = WorkspaceInvitationLinks

export async function getWorkspaceInvitation(workspaceId: string) {
  const response = sendRequest<GetWorkspaceInvitationLinksData>({
    method: 'GET',
    basePath: 'workspaces',
    path: `${workspaceId}/invitation`,
  })
  return await response
}

export type GenerateWorkspaceInvitationLinkError = WorkspacesError<'workspace_not_found'>
export type GenerateWorkspaceInvitationLinkData = Partial<WorkspaceInvitationLinks>

export async function generateWorkspaceInvitationLink(
  workspaceId: string,
  type: 'admin' | 'member'
) {
  const response = sendRequest<GetWorkspaceInvitationLinksData>({
    method: 'POST',
    basePath: 'workspaces',
    path: `${workspaceId}/invitation`,
    body: {
      type,
    },
  })
  return await response
}
