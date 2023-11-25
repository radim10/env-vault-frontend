import { Workspace, WorkspaceInvitationLinks } from '@/types/workspaces'
import sendRequest, { APIError } from '../instance'

type WorkspacesErrorCode = 'workspace_not_found' | 'missing_permission'
export type WorkspacesError<T extends WorkspacesErrorCode | void> = APIError<T>

export function workspacesErrorMsgFromCode(code?: WorkspacesErrorCode): string | null {
  let msg = null

  if (code === 'workspace_not_found') {
    msg = 'Workspace has been deleted'
  }

  if (code === 'missing_permission') {
    msg = "You don't have permission to perform this action"
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
